import { GoogleAuth } from "google-auth-library";
import { NextResponse } from "next/server";

export async function GET() {
  // For the Gemini Live WebSocket, we strongly prefer using the API key
  // because browser WebSockets do not support adding an Authorization header.
  if (process.env.GEMINI_API_KEY) {
    return NextResponse.json({
      useVertex: false,
      geminiApiKey: process.env.GEMINI_API_KEY,
    });
  }

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
      { error: "Failed to authenticate for Gemini Live API" },
      { status: 500 }
    );
  }
}
