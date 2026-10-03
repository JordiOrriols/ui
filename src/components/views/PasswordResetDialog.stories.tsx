import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordResetDialog } from "./PasswordResetDialog";
import { usePasswordResetForm } from "../../hooks/usePasswordResetForm";

const meta = {
  title: "Views/PasswordResetDialog",
  component: PasswordResetDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof PasswordResetDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function RecoveryExample() {
  const [isOpen, setOpen] = useState(false);
  const form = usePasswordResetForm({
    isOpen,
    updatePassword: async () => setOpen(false),
    messages: {
      passwordTooShort: "Use at least eight characters.",
      passwordsDoNotMatch: "Passwords do not match.",
    },
  });
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Reset password
      </button>
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
