import { useState } from "react";
import { AppShell } from "./AppShell";
import { AppNavigation, AppNavigationItem } from "./AppNavigation";
import { Button } from "../ui/button";

export default {
  title: "Views/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

function WorkspaceExample({ longContent = false }: { longContent?: boolean }) {
  const [language, setLanguage] = useState("en");
  const [signedIn, setSignedIn] = useState(true);
  return (
    <AppShell
      projectId="planner"
      header={{
        title: "Planner",
        subtitle: "Plan features and team capacity",
        language: {
          value: language,
          label: "Language",
          className: "inline-flex",
          onValueChange: setLanguage,
        },
        accountAction: {
          type: signedIn ? "signOut" : "signIn",
          label: signedIn ? "Sign out" : "Sign in",
          onClick: () => setSignedIn((current) => !current),
          title: "Owner",
        },
        navigation: (
          <AppNavigation
            label="Planner pages"
            actions={<Button variant="outline">Workspace</Button>}
          >
            <AppNavigationItem asChild>
              <a href="#estimation">Estimation</a>
            </AppNavigationItem>
            <AppNavigationItem asChild>
              <a href="#vacations">Vacations</a>
            </AppNavigationItem>
          </AppNavigation>
        ),
      }}
    >
      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold">Workspace content</h2>
        <p>Routing, workspace access and data remain app-owned.</p>
        {longContent &&
          Array.from({ length: 40 }, (_, index) => (
            <p className="py-2" key={index}>
              Feature {index + 1}
            </p>
          ))}
      </section>
    </AppShell>
  );
}
export const Workspace = { render: () => <WorkspaceExample /> };
export const LongContent = { render: () => <WorkspaceExample longContent /> };
export const FullWidth = {
  render: () => (
    <AppShell projectId="shiplog" header={{ title: "Shiplog" }} mainClassName="max-w-none">
      <p>Full-width content</p>
    </AppShell>
  ),
};
