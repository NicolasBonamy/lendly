import { parseAuthCallbackParams } from "@/lib/auth/callbackParams";

describe("parseAuthCallbackParams", () => {
  it("reads a PKCE code from the query string", () => {
    expect(parseAuthCallbackParams("?code=abc123", "")).toEqual({
      kind: "code",
      code: "abc123",
    });
  });

  it("reads a magic-link token hash from the query string", () => {
    expect(
      parseAuthCallbackParams("?token_hash=hash&type=email", ""),
    ).toEqual({
      kind: "otp",
      tokenHash: "hash",
      type: "email",
    });
  });

  it("reads implicit-flow tokens from the URL hash", () => {
    expect(
      parseAuthCallbackParams(
        "",
        "#access_token=aaa&refresh_token=bbb&type=magiclink",
      ),
    ).toEqual({
      kind: "session",
      accessToken: "aaa",
      refreshToken: "bbb",
    });
  });

  it("returns none when the URL has no auth payload", () => {
    expect(parseAuthCallbackParams("", "")).toEqual({ kind: "none" });
  });
});
