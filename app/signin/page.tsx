"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(
    "Continue with your Google account to enter the shop.",
  );

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setMessage("Redirecting to Google...");

    const redirectUrl = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
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
            <span className="eyebrow">Welcome back</span>
            <h1>Sign in to Broadr</h1>
            <p>{message}</p>

            <button
              type="button"
              className="pillButton primary googleButton"
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
