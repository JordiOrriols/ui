import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthDialog } from "./AuthDialog";
import { loginLabels } from "./login-labels";
import { Button } from "../ui/button";

const meta = {
  title: "Views/AuthDialog",
  component: AuthDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof AuthDialog>;

export default meta;
type Story = StoryObj;

function AuthExample({
  mode = "signIn",
  failure = false,
}: {
  mode?: "signIn" | "signUp";
  failure?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open authentication</Button>
      <AuthDialog
        isOpen={open}
        initialMode={mode}
        onClose={() => setOpen(false)}
        labels={loginLabels}
        messages={{
          passwordResetSent: "Check your email for the recovery link.",
          checkEmail: "Check your email to confirm your account.",
        }}
        formatError={(message) => `Account: ${message}`}
        actions={{
          signIn: async () => {
            if (failure) throw new Error("Invalid credentials");
          },
          signUp: async () => ({ needsConfirmation: true }),
          signInWithGitHub: async () => {},
          requestPasswordReset: async () => {},
        }}
      />
    </>
  );
}

export const SignIn: Story = { render: () => <AuthExample /> };
export const SignUp: Story = { render: () => <AuthExample mode="signUp" /> };
export const LocalizedFailure: Story = { render: () => <AuthExample failure /> };
