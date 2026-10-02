import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addToCart, clearCart, getCart, setCart } from "@/lib/mock-store";

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
  const items = getCart(userId);

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const productId = Number(payload.productId ?? 0);
  const quantity = Number(payload.quantity ?? 1);

  if (!productId || quantity <= 0) {
    return NextResponse.json(
      { message: "Invalid cart item." },
      { status: 400 },
    );
  }

  const userId = await getSessionUserId();
  const items = addToCart(userId, productId, quantity);

  return NextResponse.json({ items, message: "Cart updated." });
}

export async function DELETE() {
  const userId = await getSessionUserId();
  const items = clearCart(userId);
  return NextResponse.json({ items, message: "Cart cleared." });
}

export async function PUT(request: Request) {
  const payload = await request.json();
  const userId = await getSessionUserId();
  const items: Array<{ productId?: number; quantity?: number }> = Array.isArray(
    payload.items,
  )
    ? payload.items
    : [];

  const normalized = items
    .map((entry: { productId?: number; quantity?: number }) => ({
      productId: Number(entry.productId ?? 0),
      quantity: Number(entry.quantity ?? 0),
    }))
    .filter((entry) => entry.productId > 0 && entry.quantity > 0);

  const result = setCart(userId, normalized);
  return NextResponse.json({ items: result, message: "Cart synced." });
}
