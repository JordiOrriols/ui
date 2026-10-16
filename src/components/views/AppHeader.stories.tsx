import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { AppHeader } from "./AppHeader";
import { AppNavigation, AppNavigationItem } from "./AppNavigation";
import { LanguageSelector } from "./LanguageSelector";

const meta = {
  title: "Views/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj;

function HeaderExample() {
  const [language, setLanguage] = useState("en");
  const [signedIn, setSignedIn] = useState(false);
  const [activePage, setActivePage] = useState("overview");
  return (
    <AppHeader
      title="Field Notes"
      subtitle="Workspace"
      icon={<LayoutGrid className="h-5 w-5 text-white" />}
      actions={
        <LanguageSelector
          languages={[
            { code: "en", short: "EN", label: "English" },
            { code: "es", short: "ES", label: "Spanish" },
          ]}
          value={language}
          onValueChange={setLanguage}
          label="Language"
        />
      }
      accountAction={{
        type: signedIn ? "signOut" : "signIn",
        label: signedIn ? "Sign out" : "Sign in",
        onClick: () => setSignedIn((previous) => !previous),
      }}
      navigation={
        <AppNavigation
          label="Main navigation"
          actions={
            <button type="button" className="rounded-md border px-3 py-1.5 text-sm">
              Share
            </button>
          }
        >
          {[
            ["overview", "Overview"],
            ["people", "People"],
            ["settings", "Settings"],
          ].map(([page, label]) => (
            <AppNavigationItem
              key={page}
              aria-current={activePage === page ? "page" : undefined}
              onClick={() => setActivePage(page ?? "overview")}
            >
              {label}
            </AppNavigationItem>
          ))}
        </AppNavigation>
      }
    />
  );
}

export const AccountAndNavigation: Story = { render: () => <HeaderExample /> };

export const DisabledAccountAction: Story = {
  render: () => (
    <AppHeader
      title="Field Notes"
      subtitle="Workspace"
      icon={<LayoutGrid />}
      accountAction={{
        type: "signOut",
        label: "Signing out",
        title: "Please wait while your session ends",
        disabled: true,
        onClick: () => {},
      }}
    />
  ),
};

export const WithoutAccountOrNavigation: Story = {
  render: () => <AppHeader title="Field Notes" subtitle="Workspace" icon={<LayoutGrid />} />,
};

export const WithBackButton: Story = {
  render: () => (
    <AppHeader
      title="Self evaluation"
      icon={<LayoutGrid />}
      leading={
        <button type="button" aria-label="Go back" className="rounded-md p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
      }
    />
  ),
};
