import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("broadr_session");

  return NextResponse.json({ message: "Signed out successfully." });
}
