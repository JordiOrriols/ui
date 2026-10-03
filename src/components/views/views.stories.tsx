import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutGrid, Plus, User, Users } from "lucide-react";
import { Button } from "../ui/button";
import { EmptyState } from "./EmptyState";
import { SplitButton } from "./SplitButton";
import { LanguageSelector } from "./LanguageSelector";
import { Spinner, UserAvatar, ProgressIndicator, StatusBadge } from "./indicators";
import { ButtonGroup } from "./ButtonGroup";
import { ConfirmDialog } from "./ConfirmDialog";
import { Modal } from "./Modal";
import { AppHeader } from "./AppHeader";

export default { title: "Views/Ladders", tags: ["autodocs"] } satisfies Meta;
type Story = StoryObj;
export const IndividualEmptyState: Story = {
  render: () => (
    <EmptyState
      icon={<User className="w-8 h-8 text-slate-400" />}
      title="No people yet"
      description="Add a person to get started."
      action={
        <Button>
          <Plus />
          Add
        </Button>
      }
    />
  ),
};
export const TeamEmptyState: Story = {
  render: () => (
    <EmptyState
      icon={<Users className="w-8 h-8 text-slate-400" />}
      title="No teams yet"
      description="Create your first team."
      action={
        <Button>
          <Plus />
          Create team
        </Button>
      }
    />
  ),
};
export const SplitActions: Story = {
  render: () => (
    <SplitButton
      label="Share"
      eventId="example_share"
      menuLabel="Sharing options"
      onClick={() => {}}
      items={[
        { label: "Copy link", eventId: "copy", onSelect: () => {} },
        { label: "Unavailable", eventId: "unavailable", disabled: true, onSelect: () => {} },
      ]}
    />
  ),
};
function Languages() {
  const [value, setValue] = useState("en");
  return (
    <LanguageSelector
      languages={[
        { code: "en", short: "EN", label: "English" },
        { code: "es", short: "ES", label: "Spanish" },
      ]}
      value={value}
      onValueChange={setValue}
      label="Language"
      className="inline-flex"
    />
  );
}
export const LanguageMenu: Story = { render: () => <Languages /> };
export const Avatars: Story = {
  render: () => (
    <div className="flex gap-3">
      <UserAvatar label="User" />
      <UserAvatar label="Ada" fallback="AL" />
      <UserAvatar label="Missing image" src="/missing-avatar.png" fallback="?" />
    </div>
  ),
};
export const Loading: Story = { render: () => <Spinner label="Loading" /> };
export const ProgressStates: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      {[0, 60, 100, null].map((value) => (
        <ProgressIndicator key={String(value)} value={value} label="Progress" />
      ))}
    </div>
  ),
};
export const Badges: Story = {
  render: () => (
    <div className="flex gap-2">
      <StatusBadge>Draft</StatusBadge>
      <StatusBadge positive>Published</StatusBadge>
    </div>
  ),
};
function Filters() {
  const [values, setValues] = useState(["one"]);
  return (
    <ButtonGroup
      label="Filters"
      items={["one", "two", "three"].map((value) => ({
        value,
        label: value,
        selected: values.includes(value),
      }))}
      onToggle={(value) =>
        setValues((previous) =>
          previous.includes(value)
            ? previous.filter((item) => item !== value)
            : [...previous, value]
        )
      }
    />
  );
}
export const FilterButtons: Story = { render: () => <Filters /> };
function Confirmation() {
  const [isOpen, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete</Button>
      <ConfirmDialog
        isOpen={isOpen}
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        title="Delete item?"
        description="This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </>
  );
}
export const Confirm: Story = { render: () => <Confirmation /> };
function ModalExample() {
  const [isOpen, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Details"
        description="Reusable content with host-controlled actions."
        closeLabel="Close"
      >
        <p>Any content can be placed here.</p>
      </Modal>
    </>
  );
}
export const ContentModal: Story = { render: () => <ModalExample /> };
export const Header: Story = {
  render: () => (
    <AppHeader
      title="Your application"
      subtitle="Your subtitle"
      icon={<LayoutGrid className="w-5 h-5 text-white" />}
      actions={<Languages />}
    />
  ),
};
