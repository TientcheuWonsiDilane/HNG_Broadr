import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { demoUsers } from "@/lib/mock-store";

export async function POST(request: Request) {
  const payload = await request.json();
  const email = String(payload.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(payload.password ?? "");

  const matchedUser = demoUsers.find(
    (user) => user.email.toLowerCase() === email && user.password === password,
  );

  if (!matchedUser) {
    return NextResponse.json(
      { message: "Invalid email or password." },
      { status: 401 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(
    "broadr_session",
    JSON.stringify({
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  );

  return NextResponse.json({
    user: {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
    },
    message: `Welcome back, ${matchedUser.name}.`,
  });
}
