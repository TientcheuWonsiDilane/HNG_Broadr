import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createOrder, getProductById, type CartItem } from "@/lib/mock-store";

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

export async function POST(request: Request) {
  const payload = await request.json();
  const customer = {
    name: String(payload.customer?.name ?? "Guest Customer"),
    email: String(payload.customer?.email ?? "guest@broadr.com"),
    address: String(payload.customer?.address ?? "No address provided"),
  };

  const items: Array<{ id?: number; productId?: number; quantity?: number }> =
    Array.isArray(payload.items) ? payload.items : [];

  const normalizedItems: CartItem[] = items
    .map((entry: { id?: number; productId?: number; quantity?: number }) => {
      const productId = Number(entry.id ?? entry.productId ?? 0);
      const quantity = Number(entry.quantity ?? 1);
      const product = getProductById(productId);
      if (!product || quantity <= 0) return null;
      return { ...product, quantity };
    })
    .filter((item): item is CartItem => Boolean(item));

  if (!normalizedItems.length) {
    return NextResponse.json(
      { message: "Your cart is empty." },
      { status: 400 },
    );
  }

  const userId = await getSessionUserId();
  const order = createOrder(userId, customer, normalizedItems);

  return NextResponse.json({
    order,
    message: `Order ${order.id} has been placed successfully.`,
  });
}
