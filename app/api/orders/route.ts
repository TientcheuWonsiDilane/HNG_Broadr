import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOrders } from "@/lib/mock-store";

async function getSessionUserId() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("broadr_session");

  if (!sessionCookie?.value) {
    return "guest";
  }

  try {
    return JSON.parse(sessionCookie.value).id ?? "guest";
  } catch {
    return "guest";
  }
}

export async function GET() {
  const userId = await getSessionUserId();
  return NextResponse.json({ orders: getOrders(userId) });
}
