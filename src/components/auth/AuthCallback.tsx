"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { parseAuthCallbackParams } from "@/lib/auth/callbackParams";
import { createClient } from "@/lib/supabase/client";
import { texts } from "@/lib/texts";

let authCallbackInFlight: Promise<void> | null = null;

async function completeAuth(): Promise<void> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    return;
  }

  const params = parseAuthCallbackParams(
    window.location.search,
    window.location.hash,
  );

  if (params.kind === "otp") {
    const { error } = await supabase.auth.verifyOtp({
      type: params.type,
      token_hash: params.tokenHash,
    });
    if (error) {
      console.log("error", error);
      throw error;
    }
    return;
  }

  if (params.kind === "code") {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code);
    if (error) {
      console.log("error", error);
      throw error;
    }
    return;
  }

  if (params.kind === "session") {
    const { error } = await supabase.auth.setSession({
      access_token: params.accessToken,
      refresh_token: params.refreshToken,
    });
    if (error) {
      console.log("error", error);
      throw error;
    }
    return;
  }

  throw new Error("Missing auth callback parameters");
}

export function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    if (!authCallbackInFlight) {
      authCallbackInFlight = completeAuth();
    }

    void authCallbackInFlight
      .then(() => {
        if (cancelled) {
          return;
        }
        router.replace("/");
        router.refresh();
      })
      .catch((error: unknown) => {
        console.log("error", error);
        authCallbackInFlight = null;
        if (!cancelled) {
          router.replace("/login?error=auth");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8">
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        {texts.auth.completing}
      </p>
    </main>
  );
}
