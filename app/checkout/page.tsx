"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { demoProducts } from "@/lib/mock-store";

type CartEntry = { id: number; quantity: number };
type OrderEntry = {
  id: string;
  total: number;
  customer: { name: string; email: string; address: string };
  items: Array<{ id: number; quantity: number; name: string; price: number }>;
  status: string;
  createdAt: string;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [form, setForm] = useState({
    name: "Ariana Vale",
    email: "demo@broadr.com",
    address: "18 Holly Lane, London",
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("broadr_cart");
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, []);

  const cartItems = useMemo(
    () =>
      cart
        .map((entry) => {
          const product = demoProducts.find((item) => item.id === entry.id);
          if (!product) return null;
          return { ...product, quantity: entry.quantity };
        })
        .filter(Boolean) as Array<
        (typeof demoProducts)[number] & { quantity: number }
      >,
    [cart],
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const placeOrder = () => {
    if (!cartItems.length) {
      return;
    }

    const order: OrderEntry = {
      id: `ord_${Date.now()}`,
      total: subtotal,
      customer: form,
      items: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
      })),
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    const savedOrders = JSON.parse(
      localStorage.getItem("broadr_orders") || "[]",
    ) as OrderEntry[];
    localStorage.setItem(
      "broadr_orders",
      JSON.stringify([order, ...savedOrders]),
    );
    localStorage.removeItem("broadr_cart");
    window.dispatchEvent(new Event("broadr-state-change"));
    router.push("/orders");
  };

  return (
    <div className="pageShell">
      <div className="container checkoutLayout">
        <section className="checkoutPanel">
          <span className="eyebrow">Checkout</span>
          <h1>Complete your order</h1>

          <div className="checkoutForm">
            <label>
              Full name
              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Shipping address
              <textarea
                rows={4}
                value={form.address}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
              />
            </label>
          </div>

          <div className="checkoutActions">
            <Link href="/shop" className="pillButton secondary">
              Continue shopping
            </Link>
            <button
              type="button"
              className="pillButton primary"
              onClick={placeOrder}>
              Place order
            </button>
          </div>
        </section>

        <aside className="summaryPanel">
          <h3>Order summary</h3>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="summaryList">
              {cartItems.map((item) => (
                <div key={item.id} className="summaryRow">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
          )}

          <div className="summaryTotal">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
