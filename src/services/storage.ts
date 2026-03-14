import { ImageCacheKey } from '../types';
import { Storage } from '@google-cloud/storage';

let storageClient: Storage | null = null;

/** Lazily initialise the GCS client */
function getStorageClient(): Storage {
  if (!storageClient) {
    storageClient = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });
  }
  return storageClient;
}

const BUCKET_NAME = process.env.GCS_IMAGES_BUCKET ?? 'math-stories-images';

/**
 * Build a deterministic GCS object key from an ImageCacheKey.
 * Format: {characterId}_{beatType}_{conceptId}
 * Characters other than alphanumeric, dash, and underscore are stripped.
 */
export function buildCacheKey(key: ImageCacheKey): string {
  const sanitize = (s: string | number) =>
    String(s).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  return `${sanitize(key.characterId)}_${sanitize(key.beatType)}_${sanitize(key.conceptId)}.png`;
}

/**
 * Check if an image exists in GCS cache.
 * Returns the public GCS URL if found, or null on a cache miss.
 */
export async function getCachedImage(gcsKey: string): Promise<string | null> {
  try {
    const bucket = getStorageClient().bucket(BUCKET_NAME);
    const file = bucket.file(gcsKey);
    const [exists] = await file.exists();
    if (!exists) return null;
    return `https://storage.googleapis.com/${BUCKET_NAME}/${gcsKey}`;
  } catch (error) {
    console.error('[Storage] getCachedImage error:', error);
    return null;
  }
}

/**
 * Save a base64 or data-URL image to GCS and return its public URL.
 * Accepts data URLs (data:image/png;base64,...) or raw base64 strings.
 */
export async function cacheImage(gcsKey: string, imageData: string): Promise<string> {
  try {
    const bucket = getStorageClient().bucket(BUCKET_NAME);
    const file = bucket.file(gcsKey);

    // Strip data URL prefix if present
    const base64Data = imageData.startsWith('data:')
      ? imageData.split(',')[1]
      : imageData;

    const buffer = Buffer.from(base64Data, 'base64');

    await file.save(buffer, {
      metadata: {
        contentType: 'image/png',
        cacheControl: 'public, max-age=86400',
      },
      public: true,
    });

    return `https://storage.googleapis.com/${BUCKET_NAME}/${gcsKey}`;
  } catch (error) {
    console.error('[Storage] cacheImage error:', error);
    // Return the original data URL as a non-fatal fallback
    return imageData;
  }
}

/**
 * Delete a cached image from GCS (used in testing / cache invalidation).
 */
export async function deleteCachedImage(gcsKey: string): Promise<void> {
  try {
    const bucket = getStorageClient().bucket(BUCKET_NAME);
    await bucket.file(gcsKey).delete({ ignoreNotFound: true });
  } catch (error) {
    console.error('[Storage] deleteCachedImage error:', error);
  }
}
