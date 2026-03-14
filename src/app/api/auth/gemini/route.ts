import { GoogleAuth } from "google-auth-library";
import { NextResponse } from "next/server";

/**
 * GET /api/auth/gemini
 *
 * Returns credentials for the Gemini Live WebSocket connection.
 * Priority:
 *  1. Google AI Studio key (GEMINI_API_KEY) — easiest for local dev
 *  2. Vertex AI access token — required for production / Cloud Run
 */
export async function GET() {
  // Option 1: Google AI Studio API key (local dev / hackathon demo)
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (geminiApiKey) {
    return NextResponse.json({ geminiApiKey });
  }

  // Option 2: Vertex AI (GCP service account / Cloud Run)
  try {
    const auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    const projectId = await auth.getProjectId();

    return NextResponse.json({
      useVertex: true,
      accessToken: accessToken.token,
      projectId: projectId || process.env.GOOGLE_CLOUD_PROJECT_ID,
      region: process.env.GOOGLE_CLOUD_REGION || "us-central1",
    });
  } catch (error) {
    console.error("Failed to get Google Cloud token:", error);
    return NextResponse.json(
      { error: "No GEMINI_API_KEY set and Vertex AI auth failed. Check your .env file." },
      { status: 500 }
    );
  }
}
