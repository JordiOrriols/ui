import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Every app lives on a subdomain of this domain, so a cookie on it reaches all of them. */
export const SHARED_SESSION_DOMAIN = "jordiorriols.cat";

// Browsers cap a cookie at about 4 KB including its name and attributes.
const CHUNK_SIZE = 3000;
// The longest lifetime browsers accept; Supabase still expires the session itself.
const MAX_AGE_SECONDS = 400 * 24 * 60 * 60;
const MIGRATED_MARKER = "jo-shared-session";

export type CookieJar = { read(): string; write(cookie: string): void };
export type SessionStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

const documentJar: CookieJar = {
  read: () => document.cookie,
  write: (cookie) => {
    document.cookie = cookie;
  },
};

export function sharedSessionDomain(hostname: string): string | null {
  return hostname === SHARED_SESSION_DOMAIN || hostname.endsWith(`.${SHARED_SESSION_DOMAIN}`)
    ? SHARED_SESSION_DOMAIN
    : null;
}

function encode(value: string): string {
  let binary = "";
  for (const byte of new TextEncoder().encode(value)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decode(value: string): string {
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

function readCookies(jar: CookieJar): Map<string, string> {
  const cookies = new Map<string, string>();
  for (const part of jar.read().split(";")) {
    const separator = part.indexOf("=");
    if (separator > 0)
      cookies.set(part.slice(0, separator).trim(), part.slice(separator + 1).trim());
  }
  return cookies;
}

/**
 * Supabase session storage in cookies on `domain`, so every subdomain shares one sign-in. Values
 * are base64url encoded and split into numbered chunks to stay under the browser's cookie limit.
 */
export function createCookieStorage({
  domain,
  secure,
  jar = documentJar,
}: {
  domain: string;
  secure: boolean;
  jar?: CookieJar;
}): SessionStorage {
  const attributes = `; Domain=${domain}; Path=/; SameSite=Lax${secure ? "; Secure" : ""}`;
  const write = (name: string, value: string) =>
    jar.write(`${name}=${value}${attributes}; Max-Age=${MAX_AGE_SECONDS}`);
  const remove = (name: string) => jar.write(`${name}=${attributes}; Max-Age=0`);
  const chunkNames = (key: string, cookies = readCookies(jar)) => {
    const names: string[] = [];
    while (cookies.has(`${key}.${names.length}`)) names.push(`${key}.${names.length}`);
    return names;
  };

  return {
    getItem(key) {
      const cookies = readCookies(jar);
      const names = chunkNames(key, cookies);
      if (names.length === 0) return null;
      try {
        return decode(names.map((name) => cookies.get(name)).join(""));
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      const encoded = encode(value);
      const previous = chunkNames(key);
      let index = 0;
      for (let start = 0; start < encoded.length || index === 0; start += CHUNK_SIZE, index++)
        write(`${key}.${index}`, encoded.slice(start, start + CHUNK_SIZE));
      for (const name of previous.slice(index)) remove(name);
    },
    removeItem(key) {
      for (const name of chunkNames(key)) remove(name);
    },
  };
}

/**
 * Moves sessions each app kept in its own localStorage into the shared cookies once, so nobody is
 * signed out by the switch. After the first app has moved, later leftovers are discarded instead:
 * they may belong to a session that was signed out from another app since.
 */
export function adoptLocalSessions({
  storage,
  keys,
  local,
  domain,
  secure,
  jar = documentJar,
}: {
  storage: SessionStorage;
  keys: string[];
  local: Pick<Storage, "getItem" | "removeItem">;
  domain: string;
  secure: boolean;
  jar?: CookieJar;
}): void {
  if (!readCookies(jar).has(MIGRATED_MARKER)) {
    for (const key of keys) {
      const legacy = local.getItem(key);
      if (legacy !== null && storage.getItem(key) === null) storage.setItem(key, legacy);
    }
    jar.write(
      `${MIGRATED_MARKER}=1; Domain=${domain}; Path=/; SameSite=Lax${secure ? "; Secure" : ""}; Max-Age=${MAX_AGE_SECONDS}`
    );
  }
  for (const key of keys) local.removeItem(key);
}

/** The key supabase-js uses by default, kept so existing sessions are found. */
export function defaultSessionKey(supabaseUrl: string): string {
  return `sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`;
}

/**
 * The Supabase client every app uses. On the shared domain the session lives in cookies, so signing
 * in or out in one app applies to all of them; elsewhere (localhost, previews) each app keeps its own.
 */
export function createSharedSupabaseClient(url: string, publishableKey: string): SupabaseClient {
  const storageKey = defaultSessionKey(url);
  const domain =
    typeof window !== "undefined" && navigator.cookieEnabled
      ? sharedSessionDomain(window.location.hostname)
      : null;
  const storage = domain
    ? createCookieStorage({ domain, secure: window.location.protocol === "https:" })
    : null;
  if (storage && domain) {
    adoptLocalSessions({
      storage,
      keys: [storageKey, `${storageKey}-code-verifier`],
      local: window.localStorage,
      domain,
      secure: window.location.protocol === "https:",
    });
  }
  const client = createClient(url, publishableKey, {
    auth: {
      flowType: "pkce",
      persistSession: true,
      detectSessionInUrl: false,
      storageKey,
      ...(storage ? { storage } : {}),
    },
  });
  if (storage) followSignOutElsewhere(client, storage, storageKey);
  return client;
}

/**
 * supabase-js picks up a session started in another app when the tab is shown again, but not one
 * that ended there. Sign this tab out locally when the shared session is gone.
 */
function followSignOutElsewhere(client: SupabaseClient, storage: SessionStorage, key: string) {
  let signedIn = false;
  client.auth.onAuthStateChange((_event, session) => {
    signedIn = session !== null;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && signedIn && storage.getItem(key) === null)
      void client.auth.signOut({ scope: "local" });
  });
}
