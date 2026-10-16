import type { EmailOtpType, SupabaseClient } from "@supabase/supabase-js";

/** What an email or OAuth link handed back to the app in its URL. */
export type AuthCallback =
  | { kind: "code"; code: string }
  | { kind: "session"; accessToken: string; refreshToken: string; recovery: boolean }
  | { kind: "otp"; tokenHash: string; type: EmailOtpType }
  | { kind: "error"; message: string };

const OTP_TYPES: readonly EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
];
const CALLBACK_QUERY = ["code", "token_hash", "type", "error", "error_code", "error_description"];
const HASH_CALLBACK = /^#(?:.*&)?(?:access_token|error|error_description)=/;

function parse(query: URLSearchParams, hash: URLSearchParams | null): AuthCallback | null {
  const error = (key: string) => hash?.get(key) ?? query.get(key);
  const failure = error("error_description") ?? error("error");
  if (failure) return { kind: "error", message: failure };
  const accessToken = hash?.get("access_token");
  const refreshToken = hash?.get("refresh_token");
  if (accessToken && refreshToken) {
    return {
      kind: "session",
      accessToken,
      refreshToken,
      recovery: hash?.get("type") === "recovery",
    };
  }
  const code = query.get("code");
  if (code) return { kind: "code", code };
  const tokenHash = query.get("token_hash");
  const type = query.get("type") as EmailOtpType | null;
  if (tokenHash && type && OTP_TYPES.includes(type)) return { kind: "otp", tokenHash, type };
  return null;
}

/** Reads an auth callback from a URL and returns the URL without it. */
export function readAuthCallback(
  currentUrl: string
): { callback: AuthCallback; cleanUrl: string } | null {
  const url = new URL(currentUrl);
  const hash = HASH_CALLBACK.test(url.hash) ? new URLSearchParams(url.hash.slice(1)) : null;
  const callback = parse(url.searchParams, hash);
  if (!callback) return null;
  for (const key of [...CALLBACK_QUERY, "auth_app"]) url.searchParams.delete(key);
  if (hash) url.hash = "";
  return { callback, cleanUrl: url.href };
}

/**
 * Takes the auth callback out of the address bar. Call it when the app loads, before the
 * router reads the hash, and hand the result to `useSupabaseAuth`.
 */
export function takeAuthCallback(): AuthCallback | null {
  if (typeof window === "undefined") return null;
  const found = readAuthCallback(window.location.href);
  if (!found) return null;
  window.history.replaceState(window.history.state, "", found.cleanUrl);
  return found.callback;
}

const completions = new WeakMap<AuthCallback, Promise<{ recovery: boolean }>>();

async function complete(
  client: Pick<SupabaseClient, "auth">,
  callback: AuthCallback
): Promise<{ recovery: boolean }> {
  switch (callback.kind) {
    case "error":
      throw new Error(callback.message);
    case "code": {
      const { data, error } = await client.auth.exchangeCodeForSession(callback.code);
      if (error) throw new Error(error.message);
      // Newer clients say whether the code came from a recovery email; it also emits PASSWORD_RECOVERY.
      const redirectType = (data as { redirectType?: string | null }).redirectType;
      return { recovery: redirectType === "recovery" };
    }
    case "session": {
      const { error } = await client.auth.setSession({
        access_token: callback.accessToken,
        refresh_token: callback.refreshToken,
      });
      if (error) throw new Error(error.message);
      return { recovery: callback.recovery };
    }
    case "otp": {
      const { error } = await client.auth.verifyOtp({
        token_hash: callback.tokenHash,
        type: callback.type,
      });
      if (error) throw new Error(error.message);
      return { recovery: callback.type === "recovery" };
    }
  }
}

/** Signs in with the callback once, however many times it is asked (links are single use). */
export function completeAuthCallback(
  client: Pick<SupabaseClient, "auth">,
  callback: AuthCallback
): Promise<{ recovery: boolean }> {
  let pending = completions.get(callback);
  if (!pending) {
    pending = complete(client, callback);
    completions.set(callback, pending);
  }
  return pending;
}
