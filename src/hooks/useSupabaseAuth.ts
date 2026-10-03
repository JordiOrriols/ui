import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";

export type AuthClient = Pick<SupabaseClient, "auth">;

export interface AuthActions {
  signIn(email: string, password: string): Promise<void>;
  signInWithGitHub(): Promise<void>;
  signUp(email: string, password: string): Promise<{ needsConfirmation: boolean }>;
  requestPasswordReset(email: string): Promise<void>;
  updatePassword(password: string): Promise<void>;
  signOut(): Promise<void>;
}

export function useSupabaseAuth(client: AuthClient | null, redirectTo?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!client);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setUser(null);
    setLoading(!!client);
    setPasswordRecovery(false);
    setAuthError(null);
    if (!client) return;
    let active = true;
    let revision = 0;
    const { data } = client.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      revision++;
      setUser(session?.user ?? null);
      setLoading(false);
      setAuthError(null);
      if (event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
      if (event === "SIGNED_OUT") setPasswordRecovery(false);
    });
    const initialRevision = revision;
    const restore = async () => {
      try {
        const { data: sessionData, error } = await client.auth.getSession();
        if (!active || revision !== initialRevision) return;
        if (error) throw error;
        setUser(sessionData.session?.user ?? null);
        setLoading(false);
      } catch (error) {
        if (!active || revision !== initialRevision) return;
        const message = error instanceof Error ? error.message : String(error);
        console.error("Failed to restore authentication session", error);
        setAuthError(message);
        setLoading(false);
      }
    };
    void restore();
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [client]);

  const actions = useMemo<AuthActions>(() => {
    const requireClient = () => {
      if (!client) throw new Error("Authentication is not configured");
      return client;
    };
    const destination = () => redirectTo ?? `${window.location.origin}${window.location.pathname}`;
    return {
      async signIn(email, password) {
        const { error } = await requireClient().auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
      },
      async signInWithGitHub() {
        const { error } = await requireClient().auth.signInWithOAuth({
          provider: "github",
          options: { redirectTo: destination() },
        });
        if (error) throw new Error(error.message);
      },
      async signUp(email, password) {
        const { data, error } = await requireClient().auth.signUp({
          email,
          password,
          options: { emailRedirectTo: destination() },
        });
        if (error) throw new Error(error.message);
        return { needsConfirmation: !data.session };
      },
      async requestPasswordReset(email) {
        const { error } = await requireClient().auth.resetPasswordForEmail(email, {
          redirectTo: destination(),
        });
        if (error) throw new Error(error.message);
      },
      async updatePassword(password) {
        const { error } = await requireClient().auth.updateUser({ password });
        if (error) throw new Error(error.message);
        setPasswordRecovery(false);
      },
      async signOut() {
        const { error } = await requireClient().auth.signOut();
        if (error) throw new Error(error.message);
      },
    };
  }, [client, redirectTo]);

  return { authEnabled: !!client, user, loading, passwordRecovery, authError, ...actions };
}
