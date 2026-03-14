import { GoogleAuth } from "google-auth-library";
import { NextResponse } from "next/server";

export async function GET() {
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
