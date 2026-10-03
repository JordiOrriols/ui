import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShareAccessDialog, type AccessEntry } from "./ShareAccessDialog";
import { useShareAccessForm } from "../../hooks/useShareAccessForm";

const meta = {
  title: "Views/ShareAccessDialog",
  component: ShareAccessDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof ShareAccessDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function Sharing({ empty = false, loading = false }: { empty?: boolean; loading?: boolean }) {
  const [isOpen, setOpen] = useState(true);
  const [entries, setEntries] = useState<AccessEntry<"reader" | "writer">[]>(
    empty ? [] : [{ id: "ada", email: "ada@example.com", access: "reader" }]
  );
  const form = useShareAccessForm<"reader" | "writer">({
    isOpen,
    initialAccess: "reader",
    onShare: async (email, access) => {
      setEntries((previous) => [...previous, { id: email, email, access }]);
    },
    onChangeAccess: async (id, access) => {
      setEntries((previous) =>
        previous.map((entry) => (entry.id === id ? { ...entry, access } : entry))
      );
    },
    onRemove: async (id) => {
      setEntries((previous) => previous.filter((entry) => entry.id !== id));
    },
  });
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Manage access
      </button>
      <ShareAccessDialog
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        entries={entries}
        loading={loading}
        form={form}
        options={[
          { value: "reader", label: "Read" },
          { value: "writer", label: "Write" },
        ]}
        labels={{
          title: "Share workspace",
          description: "Invite collaborators.",
          email: "Email",
          permission: "Permission",
          share: "Invite",
          loading: "Loading",
          empty: "No collaborators",
          close: "Close",
          permissionFor: (email) => `Permission for ${email}`,
          remove: (email) => `Remove ${email}`,
        }}
      />
    </>
  );
}

export const ManageAccess: Story = { render: () => <Sharing /> };
export const Empty: Story = { render: () => <Sharing empty /> };
export const Loading: Story = { render: () => <Sharing loading /> };
