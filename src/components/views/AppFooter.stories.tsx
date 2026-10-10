import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppFooter } from "./AppFooter";
const meta = { title: "Views/AppFooter", component: AppFooter, tags: ["autodocs"] } satisfies Meta<
  typeof AppFooter
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
