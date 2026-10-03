"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const getRedirectUrl = () => {
  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
  return new URL("/auth/callback", configuredSiteUrl).toString();
};

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(
    "Create your Broadr account with email or continue with Google.",
  );
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleEmailSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("Creating your account...");

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
        },
        emailRedirectTo: getRedirectUrl(),
      },
    });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user && !data.session) {
      setMessage("Account created. Check your email to confirm sign in.");
      setForm({ name: "", email: "", password: "" });
      return;
    }

    if (data.session) {
      window.location.href = "/shop";
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setMessage("Redirecting to Google for account setup...");

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
          <div className="authBrandHeader">
            <Link
              href="/"
              className="brandMarkWrap authBrand"
              aria-label="Go to home page">
              <div className="brandMark">B</div>
              <span>Broadr</span>
            </Link>
          </div>

          <div className="authContent">
            <span className="eyebrow">Join us</span>
            <h1>Create your account</h1>
            <p>{message}</p>

            <form className="authForm" onSubmit={handleEmailSignUp}>
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
                  placeholder="Your full name"
                  required
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
                  placeholder="Create a password"
                  required
                  minLength={6}
                />
              </label>

              <button
                type="submit"
                className="pillButton primary"
                disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <button
              type="button"
              className="pillButton secondary googleButton"
              onClick={handleGoogleSignUp}
              disabled={isLoading}>
              {isLoading
                ? "Preparing Google sign-up..."
                : "Continue with Google"}
            </button>
          </div>

          <div className="authFooter">
            <span>Already have an account?</span>
            <Link href="/signin">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
