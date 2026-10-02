import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("broadr_session");

  if (!sessionCookie?.value) {
    return NextResponse.json({ user: null });
  }

  try {
    const user = JSON.parse(sessionCookie.value);
    return NextResponse.json({ user });
  } catch {
    cookieStore.delete("broadr_session");
    return NextResponse.json({ user: null });
  }
}
