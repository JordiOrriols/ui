import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoginDialog, type LoginLabels } from "./LoginDialog";
import { PasswordResetDialog } from "./PasswordResetDialog";
import { NameDialog } from "./NameDialog";
import { useLoginForm } from "../../hooks/useLoginForm";
import { usePasswordResetForm } from "../../hooks/usePasswordResetForm";
import { useNameForm } from "../../hooks/useNameForm";
import type { AuthActions } from "../../hooks/useSupabaseAuth";

export const loginLabels: LoginLabels = {
  signInTitle: "Sign in",
  signUpTitle: "Create account",
  forgotPasswordTitle: "Reset password",
  description: "Sign in to keep your work in sync.",
  forgotPasswordDescription: "We will email you a recovery link.",
  continueWithGitHub: "Continue with GitHub",
  email: "Email",
  password: "Password",
  forgotPassword: "Forgot password?",
  switchToSignUp: "No account? Create one",
  switchToSignIn: "Already registered? Sign in",
  backToSignIn: "Back to sign in",
  cancel: "Cancel",
  signIn: "Sign in",
  signUp: "Create account",
  sendResetEmail: "Send reset email",
};

const actions: AuthActions = {
  signIn: async () => {},
  signUp: async () => ({ needsConfirmation: true }),
  signInWithGitHub: async () => {},
  requestPasswordReset: async () => {},
  updatePassword: async () => {},
  signOut: async () => {},
};

export default { title: "Views/Auth", tags: ["autodocs"] } satisfies Meta;
type Story = StoryObj;

function LoginExample({
  mode = "signIn",
  failure = false,
}: {
  mode?: "signIn" | "signUp" | "forgotPassword";
  failure?: boolean;
}) {
  const [isOpen, setOpen] = useState(true);
  const form = useLoginForm({
    isOpen,
    initialMode: mode,
    onClose: () => setOpen(false),
    actions: failure
      ? {
          ...actions,
          signIn: async () => {
            throw new Error("Invalid credentials");
          },
        }
      : actions,
    messages: {
      passwordResetSent: "Check your email for the recovery link.",
      checkEmail: "Check your email to confirm your account.",
    },
  });
  return (
    <>
      <button onClick={() => setOpen(true)}>Open authentication</button>
      <LoginDialog
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        form={form}
        labels={loginLabels}
      />
    </>
  );
}
export const SignIn: Story = { render: () => <LoginExample /> };
export const SignUp: Story = { render: () => <LoginExample mode="signUp" /> };
export const ForgotPassword: Story = { render: () => <LoginExample mode="forgotPassword" /> };
export const InvalidCredentials: Story = { render: () => <LoginExample failure /> };

function RecoveryExample() {
  const [isOpen, setOpen] = useState(true);
  const form = usePasswordResetForm({
    isOpen,
    updatePassword: async () => {
      setOpen(false);
    },
    messages: {
      passwordTooShort: "Use at least eight characters.",
      passwordsDoNotMatch: "Passwords do not match.",
    },
  });
  return (
    <>
      <button onClick={() => setOpen(true)}>Reset password</button>
      <PasswordResetDialog
        isOpen={isOpen}
        form={form}
        labels={{
          title: "Set a new password",
          description: "Choose a strong password.",
          newPassword: "New password",
          confirmPassword: "Confirm password",
          updatePassword: "Update password",
        }}
      />
    </>
  );
}
export const PasswordRecovery: Story = { render: () => <RecoveryExample /> };

function NameExample() {
  const [isOpen, setOpen] = useState(true);
  const form = useNameForm({ isOpen, onSubmit: async () => {}, onClose: () => setOpen(false) });
  return (
    <>
      <button onClick={() => setOpen(true)}>Create item</button>
      <NameDialog
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        form={form}
        labels={{
          title: "Create item",
          description: "Give it a name.",
          name: "Name",
          cancel: "Cancel",
          submit: "Create",
        }}
      />
    </>
  );
}
export const NameForm: Story = { render: () => <NameExample /> };
