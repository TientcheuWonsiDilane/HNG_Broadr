"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncState = () => {
      try {
        const savedCart = localStorage.getItem("broadr_cart");

        if (savedCart) {
          const parsedCart = JSON.parse(savedCart) as Array<{
            quantity: number;
          }>;
          const total = parsedCart.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0,
          );
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };

    const syncSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser({
          id: session.user.id,
          name:
            session.user.user_metadata?.full_name ||
            session.user.email?.split("@")[0] ||
            "Customer",
          email: session.user.email || "",
        });
      } else {
        setUser(null);
      }
    };

    syncState();
    syncSession();
    window.addEventListener("broadr-state-change", syncState);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            name:
              session.user.user_metadata?.full_name ||
              session.user.email?.split("@")[0] ||
              "Customer",
            email: session.user.email || "",
          });
        } else {
          setUser(null);
        }
      },
    );

    return () => {
      window.removeEventListener("broadr-state-change", syncState);
      authListener.subscription.unsubscribe();
    };
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("broadr_session");
    localStorage.removeItem("broadr_cart");
    setUser(null);
    setCartCount(0);
    setMobileMenuOpen(false);
    window.dispatchEvent(new Event("broadr-state-change"));
    router.push("/");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="siteHeader">
      <div className="container headerRow">
        <Link href="/" className="brandMarkWrap" aria-label="Go to home page">
          <div className="brandMark">B</div>
          <span>Broadr</span>
        </Link>

        <button
          type="button"
          className="menuToggle"
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}>
          <span />
          <span />
          <span />
        </button>

        <div className={`headerMenu ${mobileMenuOpen ? "open" : ""}`}>
          <nav className="mainNav" aria-label="Main navigation">
            <Link
              href="/"
              className={pathname === "/" ? "navLink active" : "navLink"}
              onClick={closeMobileMenu}>
              Home
            </Link>
            <Link
              href="/shop"
              className={
                pathname.startsWith("/shop") ? "navLink active" : "navLink"
              }
              onClick={closeMobileMenu}>
              Shop
            </Link>
            <Link
              href="/about"
              className={pathname === "/about" ? "navLink active" : "navLink"}
              onClick={closeMobileMenu}>
              About
            </Link>
            <Link
              href="/orders"
              className={pathname === "/orders" ? "navLink active" : "navLink"}
              onClick={closeMobileMenu}>
              Orders
            </Link>
          </nav>

          <div className="headerActions">
            <Link
              href="/shop"
              className="navLink cartPill"
              onClick={closeMobileMenu}>
              Cart ({cartCount})
            </Link>

            {user ? (
              <>
                <span className="userBadge">{user.name}</span>
                <button
                  type="button"
                  className="pillButton secondary"
                  onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="pillButton primary"
                  onClick={closeMobileMenu}>
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="pillButton secondary"
                  onClick={closeMobileMenu}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
