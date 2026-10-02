import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    projectName: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_NAME || "Shop",
    url:
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://hgrxdnnzpaqirudvpw.supabase.co",
    anonKeyConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    serviceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    dbPasswordConfigured: Boolean(process.env.SUPABASE_DB_PASSWORD),
    status: "configured",
  });
}
