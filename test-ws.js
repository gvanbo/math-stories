const { GoogleAuth } = require('google-auth-library');
const WebSocket = require('ws');

async function main() {
  const auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  const project = await auth.getProjectId();
  const region = "us-west4"; // hardcoding test

  console.log("Token:", token.token.substring(0, 10));

  // Test 1: access_token param
  const url1 = `wss://${region}-aiplatform.googleapis.com/ws/google.cloud.aiplatform.v1beta1.LlmBidiService/BidiGenerateContent?project=${project}&location=${region}&access_token=${token.token}`;
  const ws1 = new WebSocket(url1);
  ws1.on('open', () => console.log("WS1 connected (access_token param)"));
  ws1.on('error', (e) => console.log("WS1 error:", e.message));
  ws1.on('close', (e, r) => console.log("WS1 closed", e, r.toString()));

  // Test 2: Bearer auth header
  const url2 = `wss://${region}-aiplatform.googleapis.com/ws/google.cloud.aiplatform.v1beta1.LlmBidiService/BidiGenerateContent?project=${project}&location=${region}`;
  const ws2 = new WebSocket(url2, { headers: { Authorization: `Bearer ${token.token}` } });
  ws2.on('open', () => console.log("WS2 connected (Bearer header)"));
  ws2.on('error', (e) => console.log("WS2 error:", e.message));
  ws2.on('close', (e, r) => console.log("WS2 closed", e, r.toString()));
}

main().catch(console.error);
