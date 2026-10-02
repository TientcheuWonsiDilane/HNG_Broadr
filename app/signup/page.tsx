"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(
    "Create your Broadr account with Google in a few seconds.",
  );

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setMessage("Redirecting to Google for account setup...");

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
            <span className="eyebrow">Join us</span>
            <h1>Create your account</h1>
            <p>{message}</p>

            <button
              type="button"
              className="pillButton primary googleButton"
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
