import { useState } from "react";
import { AppAccountControls, type AppAccountControlsProps } from "./AppAccountControls";
import { AppShell } from "./AppShell";

export default {
  title: "Views/AppAccountControls",
  component: AppAccountControls,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

const labels: AppAccountControlsProps["labels"] = {
  signInTitle: "Sign in to your account",
  signUpTitle: "Create account",
  forgotPasswordTitle: "Reset password",
  description: "Account access",
  forgotPasswordDescription: "Reset account access",
  continueWithGitHub: "Continue with GitHub",
  email: "Email",
  password: "Password",
  forgotPassword: "Forgot password?",
  switchToSignUp: "Create an account",
  switchToSignIn: "Already have an account",
  backToSignIn: "Back to sign in",
  cancel: "Cancel",
  signIn: "Sign in",
  signUp: "Sign up",
  sendResetEmail: "Send reset email",
};

function AccountExample({ failedSignOut = false }: { failedSignOut?: boolean }) {
  const [signedIn, setSignedIn] = useState(failedSignOut);
  return (
    <AppShell
      projectId="ladders"
      header={{
        title: "Ladders",
        actions: (
          <AppAccountControls
            projectId="ladders"
            signedIn={signedIn}
            enabled
            accountTitle="Owner"
            signOutLabel="Sign out"
            labels={labels}
            messages={{ passwordResetSent: "Reset sent", checkEmail: "Check your email" }}
            formatError={(message) => `Account: ${message}`}
            actions={{
              signIn: async (email) => {
                if (email === "invalid@example.test") throw new Error("Invalid credentials");
                setSignedIn(true);
              },
              signOut: async () => {
                if (failedSignOut) throw new Error("Sign-out failed");
                setSignedIn(false);
              },
              signUp: async () => ({ needsConfirmation: true }),
              requestPasswordReset: async () => {},
              signInWithGitHub: async () => {
                throw new Error("OAuth unavailable in this example");
              },
            }}
          />
        ),
      }}
    >
      <p>Account controls use caller-owned authentication callbacks.</p>
    </AppShell>
  );
}

export const Interactive = { render: () => <AccountExample /> };
export const SignOutFailure = { render: () => <AccountExample failedSignOut /> };
