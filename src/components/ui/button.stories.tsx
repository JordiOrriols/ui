import type { Meta, StoryObj } from "@storybook/react-vite";
import { Save, Trash2, Plus } from "lucide-react";

import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"],
    },
    asChild: {
      control: "boolean",
      description: "Render the single child instead of a <button> (Radix Slot).",
    },
    eventId: {
      control: "text",
      description: "Analytics id reported on click. Omit it to stay silent.",
    },
  },
  args: {
    children: "Button",
    variant: "default",
    size: "default",
    eventId: undefined,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus />
        New member
      </>
    ),
  },
};

export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="icon" aria-label="Save">
        <Save />
      </Button>
      <Button size="icon-sm" variant="outline" aria-label="Save">
        <Save />
      </Button>
      <Button size="icon-lg" variant="destructive" aria-label="Delete">
        <Trash2 />
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const AsChild: Story = {
  args: {
    asChild: true,
    children: <a href="#somewhere">Rendered as an anchor</a>,
  },
};

export const WithAnalytics: Story = {
  args: {
    eventId: "storybook_save_button",
    children: "Tracked button",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Clicking this button reports a `button_click` event to the configured analytics sink.",
      },
    },
  },
};
