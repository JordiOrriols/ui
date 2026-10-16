import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutGrid } from "lucide-react";
import { AppHeader } from "./AppHeader";
import { AppMain, AppPage } from "./AppPage";

const meta = {
  title: "Views/AppPage",
  component: AppPage,
  subcomponents: { AppMain },
  tags: ["autodocs"],
} satisfies Meta<typeof AppPage>;

export default meta;
type Story = StoryObj;

export const WithHeaderAndCards: Story = {
  render: () => (
    <AppPage>
      <AppHeader title="Field Notes" subtitle="Workspace" icon={<LayoutGrid />} />
      <AppMain className="grid gap-4 sm:grid-cols-2">
        {["Capacity", "Roadmap"].map((title) => (
          <section key={title} className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">Cards stay white on the page canvas.</p>
          </section>
        ))}
      </AppMain>
    </AppPage>
  ),
};
