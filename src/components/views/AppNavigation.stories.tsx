import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "radix-ui";
import { CalendarDays, Calculator, User, Users } from "lucide-react";
import { AppNavigation, AppNavigationItem } from "./AppNavigation";

const meta = {
  title: "Views/AppNavigation",
  component: AppNavigation,
  subcomponents: { AppNavigationItem },
  tags: ["autodocs"],
} satisfies Meta<typeof AppNavigation>;

export default meta;
type Story = StoryObj;

function PageLinks() {
  const [page, setPage] = useState("estimation");
  return (
    <AppNavigation
      label="Pages"
      actions={
        <button type="button" className="rounded-md border px-3 py-1.5 text-sm">
          Share
        </button>
      }
    >
      {[
        { id: "estimation", label: "Estimation", Icon: Calculator },
        { id: "vacations", label: "Vacations", Icon: CalendarDays },
      ].map(({ id, label, Icon }) => (
        <AppNavigationItem key={id} asChild>
          <a
            href={`#${id}`}
            aria-current={page === id ? "page" : undefined}
            onClick={(event) => {
              event.preventDefault();
              setPage(id);
            }}
          >
            <Icon />
            {label}
          </a>
        </AppNavigationItem>
      ))}
    </AppNavigation>
  );
}

export const RouterLinks: Story = { render: () => <PageLinks /> };

export const RadixTabs: Story = {
  render: () => (
    <Tabs.Root defaultValue="individual">
      <AppNavigation label="Views">
        <Tabs.List className="flex items-center gap-1">
          <Tabs.Trigger value="individual" asChild>
            <AppNavigationItem>
              <User />
              Individual
            </AppNavigationItem>
          </Tabs.Trigger>
          <Tabs.Trigger value="team" asChild>
            <AppNavigationItem>
              <Users />
              Team
            </AppNavigationItem>
          </Tabs.Trigger>
        </Tabs.List>
      </AppNavigation>
      <Tabs.Content value="individual" className="p-4">
        Individual view
      </Tabs.Content>
      <Tabs.Content value="team" className="p-4">
        Team view
      </Tabs.Content>
    </Tabs.Root>
  ),
};
