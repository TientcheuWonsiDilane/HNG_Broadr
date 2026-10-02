import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    clientIdConfigured: Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID),
    clientSecretConfigured: Boolean(process.env.GOOGLE_CLIENT_SECRET),
    clientId:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "999720900424-r0bvlhpkvh8cglmfkk9ds9qroed07tjm.apps.googleusercontent.com",
    status: "configured",
  });
}
