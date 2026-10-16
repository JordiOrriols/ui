import { describe, expect, it, vi } from "vitest";
import { completeAuthCallback, readAuthCallback, type AuthCallback } from "./authCallback";

const base = "https://pulse.jordiorriols.cat/";

describe("auth callbacks in the URL", () => {
  it("reads a recovery link that carries tokens in the hash and clears them", () => {
    expect(
      readAuthCallback(
        `${base}?auth_app=pulse#access_token=at&expires_in=3600&refresh_token=rt&token_type=bearer&type=recovery`
      )
    ).toEqual({
      callback: { kind: "session", accessToken: "at", refreshToken: "rt", recovery: true },
      cleanUrl: base,
    });
  });
  it("reads PKCE codes and email token hashes from the query and keeps the route", () => {
    expect(readAuthCallback(`${base}?auth_app=pulse&code=abc#/actions`)).toEqual({
      callback: { kind: "code", code: "abc" },
      cleanUrl: `${base}#/actions`,
    });
    expect(readAuthCallback(`${base}?token_hash=th&type=recovery`)).toEqual({
      callback: { kind: "otp", tokenHash: "th", type: "recovery" },
      cleanUrl: base,
    });
  });
  it("reports expired or rejected links, from the hash or the query", () => {
    expect(
      readAuthCallback(
        `${base}?auth_app=pulse#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired`
      )
    ).toEqual({
      callback: { kind: "error", message: "Email link is invalid or has expired" },
      cleanUrl: base,
    });
    expect(readAuthCallback(`${base}?error=server_error`)?.callback).toEqual({
      kind: "error",
      message: "server_error",
    });
  });
  it("ignores ordinary app URLs, including hash routes", () => {
    expect(readAuthCallback(`${base}#/team-pulse?survey=1`)).toBeNull();
    expect(readAuthCallback(`${base}?auth_app=pulse`)).toBeNull();
    expect(readAuthCallback(`${base}?token_hash=th&type=unknown`)).toBeNull();
  });
});

describe("completing auth callbacks", () => {
  function client() {
    return {
      auth: {
        exchangeCodeForSession: vi.fn(async () => ({
          data: { redirectType: "recovery" },
          error: null,
        })),
        setSession: vi.fn(async () => ({ data: {}, error: null })),
        verifyOtp: vi.fn(async () => ({ data: {}, error: { message: "Token has expired" } })),
      },
    };
  }
  type Client = Parameters<typeof completeAuthCallback>[0];

  it("signs in with each kind of link and tells whether it was a recovery", async () => {
    const c = client();
    await expect(
      completeAuthCallback(c as unknown as Client, { kind: "code", code: "abc" })
    ).resolves.toEqual({ recovery: true });
    await expect(
      completeAuthCallback(c as unknown as Client, {
        kind: "session",
        accessToken: "at",
        refreshToken: "rt",
        recovery: false,
      })
    ).resolves.toEqual({ recovery: false });
    expect(c.auth.exchangeCodeForSession).toHaveBeenCalledWith("abc");
    expect(c.auth.setSession).toHaveBeenCalledWith({ access_token: "at", refresh_token: "rt" });
  });
  it("uses a link only once, however often it is completed", async () => {
    const c = client();
    const link: AuthCallback = { kind: "code", code: "once" };
    await Promise.all([
      completeAuthCallback(c as unknown as Client, link),
      completeAuthCallback(c as unknown as Client, link),
    ]);
    expect(c.auth.exchangeCodeForSession).toHaveBeenCalledTimes(1);
  });
  it("fails with the reason for rejected and expired links", async () => {
    const c = client();
    await expect(
      completeAuthCallback(c as unknown as Client, {
        kind: "otp",
        tokenHash: "th",
        type: "recovery",
      })
    ).rejects.toThrow("Token has expired");
    await expect(
      completeAuthCallback(c as unknown as Client, { kind: "error", message: "Link expired" })
    ).rejects.toThrow("Link expired");
  });
});
