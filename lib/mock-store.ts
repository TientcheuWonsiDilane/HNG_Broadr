export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  badge: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type CartEntry = {
  productId: number;
  quantity: number;
};

export type CartItem = Product & {
  quantity: number;
};

export type Customer = {
  name: string;
  email: string;
  address: string;
};

export type Order = {
  id: string;
  userId: string;
  customer: Customer;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: string;
};

export const demoProducts: Product[] = [
  {
    id: 1,
    name: "Luma Sneaker",
    category: "Footwear",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    description:
      "Lightweight everyday sneaker with breathable mesh and cushioned sole.",
    badge: "Best seller",
  },
  {
    id: 2,
    name: "Veido Hoodie",
    category: "Apparel",
    price: 85,
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    description:
      "Soft brushed fleece hoodie designed for warm layering and movement.",
    badge: "New arrival",
  },
  {
    id: 3,
    name: "Benny Jacket",
    category: "Outerwear",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    description:
      "Structured city jacket with matte finish and thoughtful utility pockets.",
    badge: "Premium",
  },
  {
    id: 4,
    name: "Fjord Cap",
    category: "Accessories",
    price: 42,
    image:
      "https://images.unsplash.com/photo-1521369909026-2afc1c0d4f2d?auto=format&fit=crop&w=900&q=80",
    description: "Minimal cap with a clean profile and a soft cotton lining.",
    badge: "Limited",
  },
  {
    id: 5,
    name: "Seafield Tote",
    category: "Accessories",
    price: 96,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
    description:
      "Relaxed everyday tote with generous interior space and clean straps.",
    badge: "Editor pick",
  },
  {
    id: 6,
    name: "Harbor Tee",
    category: "Apparel",
    price: 52,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    description:
      "Premium cotton tee with a tailored drape and soft-touch finish.",
    badge: "Everyday",
  },
];

export const demoUsers: User[] = [
  {
    id: "user_1",
    name: "Ariana Vale",
    email: "demo@broadr.com",
    password: "broadr123",
  },
  {
    id: "user_2",
    name: "Noah Brooks",
    email: "shopper@broadr.com",
    password: "broadr123",
  },
];

const cartStore = new Map<string, CartEntry[]>();
const orderStore = new Map<string, Order[]>();

export function getProductById(productId: number): Product | undefined {
  return demoProducts.find((product) => product.id === productId);
}

export function getCart(userId: string): CartEntry[] {
  return cartStore.get(userId) ?? [];
}

export function addToCart(
  userId: string,
  productId: number,
  quantity = 1,
): CartItem[] {
  const nextCart = [...getCart(userId)];
  const existing = nextCart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    nextCart.push({ productId, quantity });
  }

  cartStore.set(userId, nextCart);

  return nextCart
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return { ...product, quantity: item.quantity };
    })
    .filter((item): item is CartItem => Boolean(item));
}

export function setCart(userId: string, items: CartEntry[]) {
  cartStore.set(userId, items);
  return items
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return { ...product, quantity: item.quantity };
    })
    .filter((item): item is CartItem => Boolean(item));
}

export function clearCart(userId: string): CartItem[] {
  cartStore.set(userId, []);
  return [];
}

export function getOrders(userId: string): Order[] {
  return orderStore.get(userId) ?? [];
}

export function createOrder(
  userId: string,
  customer: Customer,
  items: CartItem[],
): Order {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const order: Order = {
    id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    customer,
    items,
    total,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  const existing = orderStore.get(userId) ?? [];
  orderStore.set(userId, [order, ...existing]);

  return order;
}
