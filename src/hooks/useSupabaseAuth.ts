import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { completeAuthCallback, type AuthCallback } from "../lib/authCallback";

export type AuthClient = Pick<SupabaseClient, "auth">;

export interface AuthActions {
  signIn(email: string, password: string): Promise<void>;
  signInWithGitHub(): Promise<void>;
  signUp(email: string, password: string): Promise<{ needsConfirmation: boolean }>;
  requestPasswordReset(email: string): Promise<void>;
  updatePassword(password: string): Promise<void>;
  signOut(): Promise<void>;
}

/**
 * `callback` is what `takeAuthCallback()` found in the URL when the app loaded: it is completed
 * once, a recovery opens `passwordRecovery`, and a link that fails is reported in `linkError`.
 */
export function useSupabaseAuth(
  client: AuthClient | null,
  redirectTo?: string,
  callback?: AuthCallback | null
) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!client);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => {
    setUser(null);
    setLoading(!!client);
    setPasswordRecovery(false);
    setAuthError(null);
    setLinkError(null);
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
      if (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") setLinkError(null);
    });
    const initialRevision = revision;
    const restore = async () => {
      if (callback) {
        try {
          const { recovery } = await completeAuthCallback(client, callback);
          if (active && recovery) setPasswordRecovery(true);
        } catch (error) {
          if (active) setLinkError(error instanceof Error ? error.message : String(error));
        }
        if (!active) return;
      }
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
  }, [client, callback]);

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

  return {
    authEnabled: !!client,
    user,
    loading,
    passwordRecovery,
    authError,
    linkError,
    ...actions,
  };
}
