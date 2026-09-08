import { createServerClient } from "@supabase/ssr";
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { parseAuthCallbackParams } from "@/lib/auth/callbackParams";
import type { Database } from "@/lib/supabase/database";
import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/supabase/env";

function getRedirectOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return request.nextUrl.origin;
}

function redirectToLogin(origin: string) {
  return NextResponse.redirect(new URL("/login?error=auth", origin));
}

export async function GET(request: NextRequest) {
  const origin = getRedirectOrigin(request);

  if (!hasSupabaseEnv()) {
    return redirectToLogin(origin);
  }

  const params = parseAuthCallbackParams(request.nextUrl.search, "");

  if (params.kind === "none") {
    return redirectToLogin(origin);
  }

  const { url, key } = getSupabaseEnv();
  let response = NextResponse.redirect(new URL("/", origin));

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.redirect(new URL("/", origin));
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  if (params.kind === "code") {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code);
    if (error) {
      console.log("error", error);
      return redirectToLogin(origin);
    }
    return response;
  }

  if (params.kind === "otp") {
    const { error } = await supabase.auth.verifyOtp({
      type: params.type as EmailOtpType,
      token_hash: params.tokenHash,
    });
    if (error) {
      console.log("error", error);
      return redirectToLogin(origin);
    }
    return response;
  }

  return redirectToLogin(origin);
}
