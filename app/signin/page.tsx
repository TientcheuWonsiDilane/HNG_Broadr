"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const FALLBACK_APP_URL = "https://hng-broadr.onrender.com";

const getRedirectUrl = () => {
  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_APP_URL;

  try {
    const url = new URL(configuredSiteUrl);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return new URL("/auth/callback", FALLBACK_APP_URL).toString();
    }
    return new URL("/auth/callback", url.origin).toString();
  } catch {
    return new URL("/auth/callback", FALLBACK_APP_URL).toString();
  }
};

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(
    "Use your email and password, or continue with Google.",
  );
  const [form, setForm] = useState({ email: "", password: "" });

  const handleEmailSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("Checking your account...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.session) {
      window.location.href = "/shop";
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setMessage("Redirecting to Google...");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getRedirectUrl(),
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="pageShell">
      <div className="container authLayout">
        <div className="authCard">
        

          <div className="authContent">
            <span className="eyebrow">Welcome back</span>
            <h1>Sign in to Broadr</h1>
            <p>{message}</p>

            <form className="authForm" onSubmit={handleEmailSignIn}>
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
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Your password"
                  required
                />
              </label>

              <button
                type="submit"
                className="pillButton primary"
                disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in with email"}
              </button>
            </form>

            <button
              type="button"
              className="pillButton secondary googleButton"
              onClick={handleGoogleSignIn}
              disabled={isLoading}>
              {isLoading
                ? "Preparing Google sign-in..."
                : "Continue with Google"}
            </button>
          </div>

          <div className="authFooter">
            <span>Need an account?</span>
            <Link href="/signup">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
