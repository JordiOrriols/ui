import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./AppSkeleton";

export default {
  title: "Views/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export const Placeholder: StoryObj<typeof Skeleton> = { args: { className: "h-8 w-48" } };
