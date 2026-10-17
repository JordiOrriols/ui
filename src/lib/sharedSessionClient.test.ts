// @vitest-environment-options {"url":"https://planner.jordiorriols.cat/"}
import { afterEach, describe, expect, it } from "vitest";
import {
  createCookieStorage,
  createSharedSupabaseClient,
  defaultSessionKey,
} from "./sharedSession";

const URL = "https://project.supabase.co";
const KEY = defaultSessionKey(URL);
const stored = {
  access_token: "access",
  refresh_token: "refresh",
  token_type: "bearer",
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: { id: "user", email: "ada@example.com", aud: "authenticated" },
};
const domainCookies = () => createCookieStorage({ domain: "jordiorriols.cat", secure: true });

afterEach(() => {
  domainCookies().removeItem(KEY);
  document.cookie = "jo-shared-session=; Domain=jordiorriols.cat; Path=/; Max-Age=0";
  localStorage.clear();
});

describe("the shared Supabase client on the apps' domain", () => {
  it("keeps the session from before the switch, in a cookie every app can read", async () => {
    localStorage.setItem(KEY, JSON.stringify(stored));

    const client = createSharedSupabaseClient(URL, "key");
    const { data } = await client.auth.getSession();

    expect(data.session?.access_token).toBe("access");
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(JSON.parse(domainCookies().getItem(KEY)!).access_token).toBe("access");
  });

  it("signs this tab out when another app signed out", async () => {
    domainCookies().setItem(KEY, JSON.stringify(stored));
    const client = createSharedSupabaseClient(URL, "key");
    const events: string[] = [];
    await new Promise<void>((resolve) =>
      client.auth.onAuthStateChange((event) => {
        events.push(event);
        if (event === "INITIAL_SESSION") resolve();
      })
    );

    domainCookies().removeItem(KEY);
    document.dispatchEvent(new Event("visibilitychange"));

    await expect.poll(() => events).toContain("SIGNED_OUT");
    expect((await client.auth.getSession()).data.session).toBeNull();
  });
});
