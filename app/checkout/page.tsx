"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFlutterwave } from "flutterwave-react-v3";
import { demoProducts } from "@/lib/mock-store";

type CartEntry = { id: number; quantity: number };
type OrderEntry = {
  id: string;
  total: number;
  customer: { name: string; email: string; address: string };
  items: Array<{ id: number; quantity: number; name: string; price: number }>;
  status: string;
  createdAt: string;
  paymentReference?: string;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
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

  const placeOrder = async (paymentReference?: string) => {
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
      status: paymentReference ? "paid" : "confirmed",
      createdAt: new Date().toISOString(),
      paymentReference,
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

  const handleFlutterPayment = useFlutterwave({
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "",
    tx_ref: `broadr_${Date.now()}`,
    amount: subtotal,
    currency: "USD",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: form.email || "guest@broadr.com",
      name: form.name || "Guest Customer",
      phone_number: "",
    },
    customizations: {
      title: "Broadr Payment",
      description: "Payment for your Broadr order",
      logo: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=320&q=80",
    },
  });

  const payNow = () => {
    if (!cartItems.length) {
      return;
    }

    if (!process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY) {
      setPaymentError(
        "Flutterwave is not configured. Add the public key to your environment variables.",
      );
      return;
    }

    setPaymentError("");
    setIsProcessing(true);

    handleFlutterPayment({
      callback: async (response) => {
        try {
          const verification = await fetch("/api/flutterwave", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transaction_id: response.transaction_id,
              tx_ref: response.tx_ref,
              amount: subtotal,
              currency: "USD",
              customer: form,
              items: cartItems.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                name: item.name,
                price: item.price,
              })),
            }),
          });

          const result = await verification.json();

          if (!verification.ok || !result.ok) {
            throw new Error(result.message || "Payment could not be verified.");
          }

          await placeOrder(result.payment?.id || response.tx_ref);
        } catch (error) {
          setPaymentError(
            error instanceof Error
              ? error.message
              : "Payment verification failed.",
          );
        } finally {
          setIsProcessing(false);
        }
      },
      onClose: () => {
        setIsProcessing(false);
        setPaymentError("Payment window closed. Your cart is still saved.");
      },
    });
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
              onClick={payNow}
              disabled={isProcessing || cartItems.length === 0}>
              {isProcessing ? "Processing..." : "Pay with Flutterwave"}
            </button>
          </div>

          {paymentError ? <p className="errorMessage">{paymentError}</p> : null}
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
