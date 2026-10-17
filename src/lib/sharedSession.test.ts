import { describe, expect, it } from "vitest";
import {
  adoptLocalSessions,
  createCookieStorage,
  defaultSessionKey,
  sharedSessionDomain,
  type CookieJar,
} from "./sharedSession";

/** One cookie jar for the whole domain, as every subdomain sees it. */
function domainJar() {
  const cookies = new Map<string, string>();
  const written: string[] = [];
  const jar: CookieJar = {
    read: () => [...cookies].map(([name, value]) => `${name}=${value}`).join("; "),
    write: (cookie) => {
      written.push(cookie);
      const [pair = ""] = cookie.split(";");
      const separator = pair.indexOf("=");
      const name = pair.slice(0, separator);
      if (/Max-Age=0(;|$)/.test(cookie)) cookies.delete(name);
      else cookies.set(name, pair.slice(separator + 1));
    },
  };
  return { jar, cookies, written };
}

function memoryLocalStorage(entries: Record<string, string> = {}) {
  const items = new Map(Object.entries(entries));
  return {
    getItem: (key: string) => items.get(key) ?? null,
    removeItem: (key: string) => void items.delete(key),
    items,
  };
}

const KEY = "sb-project-auth-token";
const session = (token: string) =>
  JSON.stringify({ access_token: token, refresh_token: "r", user: { name: "Núria ✓" } });

describe("shared session domain", () => {
  it("shares the session only on the apps' own domain", () => {
    expect(sharedSessionDomain("planner.jordiorriols.cat")).toBe("jordiorriols.cat");
    expect(sharedSessionDomain("jordiorriols.cat")).toBe("jordiorriols.cat");
    for (const host of [
      "localhost",
      "127.0.0.1",
      "evil-jordiorriols.cat",
      "jordiorriols.cat.example.com",
    ])
      expect(sharedSessionDomain(host)).toBeNull();
  });

  it("uses the key supabase-js picks by default, so existing sessions are found", () => {
    expect(defaultSessionKey("https://gsjardmwimvoefznzhgc.supabase.co")).toBe(
      "sb-gsjardmwimvoefznzhgc-auth-token"
    );
  });
});

describe("cookie session storage", () => {
  it("lets every app read the session another app stored", () => {
    const { jar, written } = domainJar();
    const planner = createCookieStorage({ domain: "jordiorriols.cat", secure: true, jar });
    const ladders = createCookieStorage({ domain: "jordiorriols.cat", secure: true, jar });

    planner.setItem(KEY, session("a"));

    expect(ladders.getItem(KEY)).toBe(session("a"));
    expect(written[0]).toMatch(/; Domain=jordiorriols\.cat; Path=\/; SameSite=Lax; Secure;/);
    ladders.removeItem(KEY);
    expect(planner.getItem(KEY)).toBeNull();
  });

  it("splits a large session into cookies the browser accepts and drops unused chunks", () => {
    const { jar, cookies, written } = domainJar();
    const storage = createCookieStorage({ domain: "jordiorriols.cat", secure: true, jar });
    const large = session("x".repeat(7000));

    storage.setItem(KEY, large);
    expect([...cookies.keys()]).toEqual([`${KEY}.0`, `${KEY}.1`, `${KEY}.2`, `${KEY}.3`]);
    for (const cookie of written) expect(cookie.length).toBeLessThan(4096);
    expect(storage.getItem(KEY)).toBe(large);

    storage.setItem(KEY, session("short"));
    expect([...cookies.keys()]).toEqual([`${KEY}.0`]);
    expect(storage.getItem(KEY)).toBe(session("short"));
  });

  it("treats a damaged cookie as no session", () => {
    const { jar, cookies } = domainJar();
    const storage = createCookieStorage({ domain: "jordiorriols.cat", secure: false, jar });
    cookies.set(`${KEY}.0`, "%%%");
    expect(storage.getItem(KEY)).toBeNull();
  });
});

describe("moving per-app sessions to the shared cookie", () => {
  it("keeps the first app signed in and never brings back a later app's stale session", () => {
    const { jar } = domainJar();
    const options = { domain: "jordiorriols.cat", secure: true, jar };
    const storage = createCookieStorage(options);

    const planner = memoryLocalStorage({ [KEY]: session("planner") });
    adoptLocalSessions({ ...options, storage, keys: [KEY], local: planner });
    expect(storage.getItem(KEY)).toBe(session("planner"));
    expect(planner.items.has(KEY)).toBe(false);

    // Signed out in Planner, then Ladders opens with the session it kept from before the switch.
    storage.removeItem(KEY);
    const ladders = memoryLocalStorage({ [KEY]: session("ladders") });
    adoptLocalSessions({ ...options, storage, keys: [KEY], local: ladders });
    expect(storage.getItem(KEY)).toBeNull();
    expect(ladders.items.has(KEY)).toBe(false);
  });

  it("does not replace a shared session with an app's older one", () => {
    const { jar } = domainJar();
    const options = { domain: "jordiorriols.cat", secure: true, jar };
    const storage = createCookieStorage(options);
    storage.setItem(KEY, session("shared"));

    adoptLocalSessions({
      ...options,
      storage,
      keys: [KEY],
      local: memoryLocalStorage({ [KEY]: session("old") }),
    });
    expect(storage.getItem(KEY)).toBe(session("shared"));
  });
});
