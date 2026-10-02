"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { demoProducts } from "@/lib/mock-store";
import { supabase } from "@/lib/supabase";

type Product = (typeof demoProducts)[number];
type CartEntry = { id: number; quantity: number };

const categoryFilters = [
  "All",
  "Footwear",
  "Apparel",
  "Outerwear",
  "Accessories",
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

export default function ShopPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [session, setSession] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [cart, setCart] = useState<CartEntry[]>([]);

  useEffect(() => {
    const syncState = () => {
      try {
        const savedCart = localStorage.getItem("broadr_cart");
        setCart(savedCart ? JSON.parse(savedCart) : []);
      } catch {
        setCart([]);
      }
    };

    const syncSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (currentSession?.user) {
        setSession({
          name:
            currentSession.user.user_metadata?.full_name ||
            currentSession.user.email?.split("@")[0] ||
            "Customer",
          email: currentSession.user.email || "",
        });
      } else {
        setSession(null);
      }
    };

    syncState();
    syncSession();
    window.addEventListener("broadr-state-change", syncState);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(
          currentSession?.user
            ? {
                name:
                  currentSession.user.user_metadata?.full_name ||
                  currentSession.user.email?.split("@")[0] ||
                  "Customer",
                email: currentSession.user.email || "",
              }
            : null,
        );
      },
    );

    return () => {
      window.removeEventListener("broadr-state-change", syncState);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return demoProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = demoProducts.find((entry) => entry.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0),
    [cart],
  );

  const addToCart = (product: Product) => {
    const nextCart = [...cart];
    const existing = nextCart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      nextCart.push({ id: product.id, quantity: 1 });
    }

    localStorage.setItem("broadr_cart", JSON.stringify(nextCart));
    setCart(nextCart);
    window.dispatchEvent(new Event("broadr-state-change"));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("broadr_session");
    setSession(null);
    window.dispatchEvent(new Event("broadr-state-change"));
    router.push("/");
  };

  const clearSearch = () => {
    setSearch("");
    setSelectedCategory("All");
  };

  return (
    <div className="pageShell">
      <div className="container storefrontLayout">
        <aside className="sidebarPanel">
          <div className="sidebarHeader">
            <h3>Broadr menu</h3>
          </div>

          {session ? (
            <div className="sidebarUserBox">
              <p>{session.name}</p>
              <small>{session.email}</small>
              <button
                type="button"
                className="pillButton secondary"
                onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="sidebarActions">
              <Link href="/signin" className="pillButton primary fullWidth">
                Sign in
              </Link>
              <Link href="/signup" className="pillButton secondary fullWidth">
                Sign up
              </Link>
            </div>
          )}

          <div className="sidebarSection">
            <h4>Search</h4>
            <div className="searchGroup">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
                aria-label="Search products"
              />
              <button
                type="button"
                className="pillButton primary"
                onClick={() => setSelectedCategory("All")}>
                Search
              </button>
            </div>
            {search ? (
              <button
                type="button"
                className="textButton"
                onClick={clearSearch}>
                Clear search
              </button>
            ) : null}
          </div>

          <div className="sidebarSection">
            <h4>Categories</h4>
            <div className="tagList">
              {categoryFilters.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    selectedCategory === category ? "tagActive" : "tagButton"
                  }
                  onClick={() => setSelectedCategory(category)}>
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebarSection cartBox">
            <h4>Cart</h4>
            <p>{cartCount} items</p>
            <strong>{formatPrice(subtotal)}</strong>
            <Link href="/checkout" className="pillButton primary fullWidth">
              Checkout
            </Link>
          </div>
        </aside>

        <section className="contentArea">
          <div className="introRow">
            <div>
              <span className="eyebrow">Shop all</span>
              <h1>Fresh essentials.</h1>
            </div>
            <Link href="/about" className="secondaryButton inlineButton">
              Learn more
            </Link>
          </div>

          <div className="productGridShop">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <article key={product.id} className="productCardShop">
                  <img src={product.image} alt={product.name} />
                  <div className="productMetaShop">
                    <span className="productBadge">{product.badge}</span>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="productFooter">
                      <strong>{formatPrice(product.price)}</strong>
                      <button
                        type="button"
                        className="pillButton primary"
                        onClick={() => addToCart(product)}>
                        Add to cart
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="emptyPanel">
                <h3>No products found</h3>
                <p>Try another search or choose a different category.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
