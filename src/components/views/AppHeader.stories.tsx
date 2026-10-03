import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutGrid } from "lucide-react";
import { AppHeader } from "./AppHeader";
import { LanguageSelector } from "./LanguageSelector";

const meta = {
  title: "Views/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

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
        <nav aria-label="Main navigation" className="flex gap-2 py-2">
          {[
            ["overview", "Overview"],
            ["people", "People"],
            ["settings", "Settings"],
          ].map(([page, label]) => (
            <button
              key={page}
              type="button"
              aria-current={activePage === page ? "page" : undefined}
              onClick={() => setActivePage(page)}
              className={`rounded-md px-3 py-1.5 text-sm ${
                activePage === page
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
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
