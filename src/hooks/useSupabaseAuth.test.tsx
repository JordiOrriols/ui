import { act, renderHook, waitFor } from "@testing-library/react";
import { AuthError, createClient, type Session, type User } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { useSupabaseAuth } from "./useSupabaseAuth";

const user: User = {
  id: "user",
  email: "ada@example.com",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "",
};
const session: Session = {
  user,
  access_token: "test",
  refresh_token: "test",
  expires_in: 3600,
  token_type: "bearer",
};
function fixture() {
  const client = createClient("http://localhost:54321", "test-anon-key", {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  let listener: Parameters<typeof client.auth.onAuthStateChange>[0] = () => {};
  const unsubscribe = vi.fn();
  vi.spyOn(client.auth, "onAuthStateChange").mockImplementation((callback) => {
    listener = callback;
    return { data: { subscription: { id: "test", callback, unsubscribe } } };
  });
  const getSession = vi
    .spyOn(client.auth, "getSession")
    .mockResolvedValue({ data: { session: null }, error: null });
  return {
    client,
    getSession,
    unsubscribe,
    emit: (event: Parameters<typeof listener>[0], next: Session | null) => listener(event, next),
  };
}
describe("shared Supabase authentication", () => {
  it("does not require tables and restores a session, refreshes users and unsubscribes", async () => {
    const f = fixture();
    f.getSession.mockResolvedValue({ data: { session }, error: null });
    const { result, unmount } = renderHook(() => useSupabaseAuth(f.client));
    await waitFor(() => expect(result.current.user).toEqual(user));
    expect(result.current.loading).toBe(false);
    await act(async () =>
      f.emit("TOKEN_REFRESHED", { ...session, user: { ...user, email: "new@example.com" } })
    );
    expect(result.current.user?.email).toBe("new@example.com");
    unmount();
    expect(f.unsubscribe).toHaveBeenCalledOnce();
  });
  it("does not overwrite a newer auth event with stale session restoration", async () => {
    const f = fixture();
    let finish!: (value: Awaited<ReturnType<typeof f.client.auth.getSession>>) => void;
    f.getSession.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    const { result } = renderHook(() => useSupabaseAuth(f.client));
    await act(async () => f.emit("SIGNED_IN", session));
    await act(async () => finish({ data: { session: null }, error: null }));
    expect(result.current.user).toEqual(user);
  });
  it("exposes and logs session restoration errors", async () => {
    const f = fixture();
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    f.getSession.mockResolvedValue({
      data: { session: null },
      error: new AuthError("Unavailable"),
    });
    const { result } = renderHook(() => useSupabaseAuth(f.client));
    await waitFor(() => expect(result.current.authError).toBe("Unavailable"));
    expect(result.current.loading).toBe(false);
    expect(log).toHaveBeenCalledOnce();
    log.mockRestore();
  });
  it("rejects unconfigured auth instead of reporting success", async () => {
    const { result } = renderHook(() => useSupabaseAuth(null));
    expect(result.current.authEnabled).toBe(false);
    expect(result.current.loading).toBe(false);
    await expect(result.current.signIn("a@b.co", "password")).rejects.toThrow("not configured");
    await expect(result.current.signUp("a@b.co", "password")).rejects.toThrow("not configured");
  });
  it("preserves signin, OAuth, signup confirmation and reset redirects", async () => {
    const f = fixture();
    const signIn = vi
      .spyOn(f.client.auth, "signInWithPassword")
      .mockResolvedValue({ data: { user, session }, error: null });
    const oauth = vi
      .spyOn(f.client.auth, "signInWithOAuth")
      .mockResolvedValue({ data: { provider: "github", url: "https://example.com" }, error: null });
    const signUp = vi
      .spyOn(f.client.auth, "signUp")
      .mockResolvedValue({ data: { user, session: null }, error: null });
    const reset = vi
      .spyOn(f.client.auth, "resetPasswordForEmail")
      .mockResolvedValue({ data: {}, error: null });
    const { result } = renderHook(() => useSupabaseAuth(f.client, "https://example.com/planner"));
    await act(async () => {
      await result.current.signIn("ada@example.com", "password");
      await result.current.signInWithGitHub();
      expect(await result.current.signUp("ada@example.com", "password")).toEqual({
        needsConfirmation: true,
      });
      await result.current.requestPasswordReset("ada@example.com");
    });
    expect(signIn).toHaveBeenCalledWith({ email: "ada@example.com", password: "password" });
    expect(oauth).toHaveBeenCalledWith({
      provider: "github",
      options: { redirectTo: "https://example.com/planner" },
    });
    expect(signUp).toHaveBeenCalledWith({
      email: "ada@example.com",
      password: "password",
      options: { emailRedirectTo: "https://example.com/planner" },
    });
    expect(reset).toHaveBeenCalledWith("ada@example.com", {
      redirectTo: "https://example.com/planner",
    });
  });
  it("keeps recovery open after update failure and closes it after success", async () => {
    const f = fixture();
    const update = vi
      .spyOn(f.client.auth, "updateUser")
      .mockResolvedValue({ data: { user: null }, error: new AuthError("Rejected") });
    const { result } = renderHook(() => useSupabaseAuth(f.client));
    await act(async () => f.emit("PASSWORD_RECOVERY", session));
    await act(async () => {
      await expect(result.current.updatePassword("password")).rejects.toThrow("Rejected");
    });
    expect(result.current.passwordRecovery).toBe(true);
    update.mockResolvedValue({ data: { user }, error: null });
    await act(async () => result.current.updatePassword("password"));
    expect(result.current.passwordRecovery).toBe(false);
  });
  it("throws sign-out failures and clears recovery when signed out", async () => {
    const f = fixture();
    vi.spyOn(f.client.auth, "signOut").mockResolvedValue({
      error: new AuthError("Sign out failed"),
    });
    const { result } = renderHook(() => useSupabaseAuth(f.client));
    await act(async () => f.emit("PASSWORD_RECOVERY", session));
    await expect(result.current.signOut()).rejects.toThrow("Sign out failed");
    await act(async () => f.emit("SIGNED_OUT", null));
    expect(result.current.passwordRecovery).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
