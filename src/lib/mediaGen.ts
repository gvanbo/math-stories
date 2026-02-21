import { GoogleAuth } from 'google-auth-library';

export interface MediaResponse {
  type: 'image' | 'video';
  mimeType: string;
  dataBase64: string;
  error?: string;
}

/**
 * Generates an image or video using Vertex AI (Imagen 3 / Veo).
 * Note: Video generation typically takes longer and may require async batching in production.
 * This function serves as the wrapper for the generative media pipeline.
 */
export async function generateMedia(prompt: string, type: 'image' | 'video'): Promise<MediaResponse> {
  try {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    // Fallback to local API key definition if no Google Cloud auth is available (for local dev)
    const projectId = (await auth.getProjectId()) || process.env.GOOGLE_CLOUD_PROJECT_ID;
    
    // If no project ID is configured to use Vertex AI, mock the response to avoid failure
    // This allows local dev testing without a fully configured GCP project
    if (!projectId) {
      console.warn("No GCP project configured. Media generation mocked.");
      return {
        type,
        mimeType: type === 'image' ? 'image/png' : 'video/mp4',
        dataBase64: "MOCKED_BASE64_DATA_" + Math.random().toString(36).substring(7),
      };
    }

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    const region = process.env.GOOGLE_CLOUD_REGION || 'us-central1';

    if (type === 'image') {
       // Imagen 3 Endpoint
       const endpoint = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/imagen-3.0-generate-001:predict`;
       
       const response = await fetch(endpoint, {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${accessToken.token}`,
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           instances: [{ prompt }],
           parameters: {
             sampleCount: 1,
             aspectRatio: "16:9",
             outputOptions: { mimeType: "image/png" }
           }
         })
       });

       if (!response.ok) throw new Error(`Imagen 3 Error: ${await response.text()}`);
       
       const data = await response.json();
       const base64 = data.predictions?.[0]?.bytesBase64Encoded;
       if (!base64) throw new Error("No image data returned from Imagen");

       return { type: 'image', mimeType: 'image/png', dataBase64: base64 };
    } else {
       // Veo Endpoint (Simulated structure. In production Veo is currently via private preview or batch API)
       const endpoint = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/veo-01-preview:predict`;
       
       const response = await fetch(endpoint, {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${accessToken.token}`,
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           instances: [{ prompt }],
           parameters: { }
         })
       });

       if (!response.ok) throw new Error(`Veo Error: ${await response.text()}`);
       
       const data = await response.json();
       const base64 = data.predictions?.[0]?.bytesBase64Encoded;
       if (!base64) throw new Error("No video data returned from Veo");

       return { type: 'video', mimeType: 'video/mp4', dataBase64: base64 };
    }
  } catch (error) {
    console.error(`Media generation failed for ${type}:`, error);
    return { type, mimeType: '', dataBase64: '', error: (error as Error).message };
  }
}
