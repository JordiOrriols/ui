import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./indicators";

const meta = {
  title: "Views/Spinner",
  component: Spinner,
  tags: ["autodocs"],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = { args: { label: "Loading" } };
