import type { EmailOtpType } from "@supabase/supabase-js";

const EMAIL_OTP_TYPES: EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
];

export type AuthCallbackParams =
  | { kind: "code"; code: string }
  | { kind: "otp"; tokenHash: string; type: EmailOtpType }
  | { kind: "session"; accessToken: string; refreshToken: string }
  | { kind: "none" };

function isEmailOtpType(value: string): value is EmailOtpType {
  return EMAIL_OTP_TYPES.includes(value as EmailOtpType);
}

export function parseAuthCallbackParams(
  search: string,
  hash: string,
): AuthCallbackParams {
  const query = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  const hashParams = new URLSearchParams(
    hash.startsWith("#") ? hash.slice(1) : hash,
  );

  const tokenHash = query.get("token_hash");
  const type = query.get("type");
  if (tokenHash && type && isEmailOtpType(type)) {
    return { kind: "otp", tokenHash, type };
  }

  const code = query.get("code");
  if (code) {
    return { kind: "code", code };
  }

  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");
  if (accessToken && refreshToken) {
    return { kind: "session", accessToken, refreshToken };
  }

  return { kind: "none" };
}
