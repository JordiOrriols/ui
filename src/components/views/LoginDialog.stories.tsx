import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoginDialog } from "./LoginDialog";
import { loginLabels } from "./login-labels";
import { useLoginForm } from "../../hooks/useLoginForm";
import type { AuthActions } from "../../hooks/useSupabaseAuth";

const actions: AuthActions = {
  signIn: async () => {},
  signUp: async () => ({ needsConfirmation: true }),
  signInWithGitHub: async () => {},
  requestPasswordReset: async () => {},
  updatePassword: async () => {},
  signOut: async () => {},
};

const meta = {
  title: "Views/LoginDialog",
  component: LoginDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof LoginDialog>;

export default meta;
type Story = StoryObj;

function LoginExample({
  mode = "signIn",
  failure = false,
}: {
  mode?: "signIn" | "signUp" | "forgotPassword";
  failure?: boolean;
}) {
  const [isOpen, setOpen] = useState(false);
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
      <button type="button" onClick={() => setOpen(true)}>
        Open authentication
      </button>
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
