"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderEntry[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(
      localStorage.getItem("broadr_orders") || "[]",
    ) as OrderEntry[];
    setOrders(savedOrders);
  }, []);

  return (
    <div className="pageShell">
      <div className="container sectionLayout narrow">
        <div className="contentBlock">
          <span className="eyebrow">Your orders</span>
          <h1>Recent activity</h1>

          {orders.length === 0 ? (
            <div className="emptyPanel">
              <h3>No orders yet</h3>
              <p>
                Your placed orders will appear here once you complete a
                purchase.
              </p>
              <Link href="/shop" className="pillButton primary">
                Shop now
              </Link>
            </div>
          ) : (
            <div className="orderList">
              {orders.map((order) => (
                <div key={order.id} className="orderItemCard">
                  <div className="orderItemHeader">
                    <strong>{order.id}</strong>
                    <span>{order.status}</span>
                  </div>
                  <p>{order.customer.name}</p>
                  <p>{order.items.length} item(s)</p>
                  <p>{formatPrice(order.total)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
