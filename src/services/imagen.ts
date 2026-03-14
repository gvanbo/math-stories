import { BeatVisualSpec, ExpressionType, ImageCacheKey, SceneImage } from '../types';
import { getCachedImage, cacheImage, buildCacheKey } from './storage';

const IMAGEN_API_ENDPOINT = 'https://us-central1-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/** Placeholder SVG returned when all Imagen retries fail */
const FALLBACK_SVG_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTJlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMiIgZmlsbD0iIzlhOWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1hdGggU3RvcmllczwvdGV4dD48L3N2Zz4=';

/** Pause execution for a given number of ms */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Call the Vertex AI Imagen 3 API with retry logic */
async function callImagenAPI(prompt: string, attempt = 1): Promise<string> {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  if (!projectId) throw new Error('GOOGLE_CLOUD_PROJECT_ID env var is not set');

  const url = IMAGEN_API_ENDPOINT.replace('{PROJECT_ID}', projectId);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GOOGLE_ACCESS_TOKEN ?? ''}`,
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: '4:3',
          safetyFilterLevel: 'block_some',
          personGeneration: 'dont_allow',
        },
      }),
    });

    if (response.status === 429 || response.status === 503) {
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
        return callImagenAPI(prompt, attempt + 1);
      }
      throw new Error(`Imagen API rate limited after ${MAX_RETRIES} attempts`);
    }

    if (!response.ok) {
      throw new Error(`Imagen API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const base64Image: string = data?.predictions?.[0]?.bytesBase64Encoded;
    if (!base64Image) throw new Error('Imagen API returned empty prediction');

    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      await sleep(RETRY_DELAY_MS * attempt);
      return callImagenAPI(prompt, attempt + 1);
    }
    throw error;
  }
}

/**
 * Generate a full scene image for a story beat.
 * Checks the GCS cache first; falls back to Imagen 3 generation.
 */
export async function generateSceneImage(
  spec: BeatVisualSpec,
  conceptId: string
): Promise<SceneImage> {
  const primaryCharacterId = spec.characters[0] ?? 0;
  const cacheKey: ImageCacheKey = {
    characterId: primaryCharacterId,
    beatType: spec.sceneType as any,
    conceptId,
  };

  const gcsKey = buildCacheKey(cacheKey);
  const cached = await getCachedImage(gcsKey);

  if (cached) {
    return {
      beatType: spec.sceneType as any,
      characterId: primaryCharacterId,
      conceptId,
      imageUrl: cached,
      gcsCacheKey: gcsKey,
      generatedAt: new Date().toISOString(),
      sceneType: spec.sceneType,
      prompt: spec.imagenPrompt,
    };
  }

  let imageUrl: string;
  try {
    imageUrl = await callImagenAPI(spec.imagenPrompt);
    await cacheImage(gcsKey, imageUrl);
  } catch {
    console.error('[Imagen] Generation failed, using fallback SVG');
    imageUrl = FALLBACK_SVG_DATA_URL;
  }

  return {
    beatType: spec.sceneType as any,
    characterId: primaryCharacterId,
    conceptId,
    imageUrl,
    gcsCacheKey: gcsKey,
    generatedAt: new Date().toISOString(),
    sceneType: spec.sceneType,
    prompt: spec.imagenPrompt,
  };
}

/**
 * Generate a character portrait in a specific expression.
 * Used for CharacterCard and story panel overlays.
 */
export async function generateCharacterPortrait(
  digit: number,
  expression: ExpressionType,
  basePrompt: string,
  expressionPrompt: string,
  imagenStyleTags: string[]
): Promise<SceneImage> {
  const prompt = `${basePrompt} ${expressionPrompt}, ${imagenStyleTags.join(', ')}, educational illustration, Grade 4 math, safe for children`;

  const cacheKey: ImageCacheKey = {
    characterId: digit,
    beatType: 'setup',
    conceptId: `portrait_${expression}`,
  };

  const gcsKey = buildCacheKey(cacheKey);
  const cached = await getCachedImage(gcsKey);

  if (cached) {
    return {
      beatType: 'setup',
      characterId: digit,
      conceptId: `portrait_${expression}`,
      imageUrl: cached,
      gcsCacheKey: gcsKey,
      generatedAt: new Date().toISOString(),
      sceneType: 'closeUpReaction',
      prompt,
    };
  }

  let imageUrl: string;
  try {
    imageUrl = await callImagenAPI(prompt);
    await cacheImage(gcsKey, imageUrl);
  } catch {
    imageUrl = FALLBACK_SVG_DATA_URL;
  }

  return {
    beatType: 'setup',
    characterId: digit,
    conceptId: `portrait_${expression}`,
    imageUrl,
    gcsCacheKey: gcsKey,
    generatedAt: new Date().toISOString(),
    sceneType: 'closeUpReaction',
    prompt,
  };
}

/**
 * Generate a pedagogy tool diagram image.
 * Used in representation beats for bar models, arrays, WODB grids, etc.
 */
export async function generatePedagogyDiagram(
  toolId: string,
  conceptId: string,
  conceptDescription: string
): Promise<SceneImage> {
  const prompt = `Educational math diagram showing ${toolId} for Grade 4: ${conceptDescription}. Clean white background, bright colours, labeled, flat design illustration.`;

  const cacheKey: ImageCacheKey = {
    characterId: -1,
    beatType: 'representation',
    conceptId: `${toolId}_${conceptId}`,
  };

  const gcsKey = buildCacheKey(cacheKey);
  const cached = await getCachedImage(gcsKey);

  if (cached) {
    return {
      beatType: 'representation',
      characterId: -1,
      conceptId: `${toolId}_${conceptId}`,
      imageUrl: cached,
      gcsCacheKey: gcsKey,
      generatedAt: new Date().toISOString(),
      sceneType: 'pedagogyToolDiagram',
      prompt,
    };
  }

  let imageUrl: string;
  try {
    imageUrl = await callImagenAPI(prompt);
    await cacheImage(gcsKey, imageUrl);
  } catch {
    imageUrl = FALLBACK_SVG_DATA_URL;
  }

  return {
    beatType: 'representation',
    characterId: -1,
    conceptId: `${toolId}_${conceptId}`,
    imageUrl,
    gcsCacheKey: gcsKey,
    generatedAt: new Date().toISOString(),
    sceneType: 'pedagogyToolDiagram',
    prompt,
  };
}
