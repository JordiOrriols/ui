import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppSkeleton } from "./AppSkeleton";

export default {
  title: "Views/AppSkeleton",
  component: AppSkeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof AppSkeleton>;

export const Application: StoryObj<typeof AppSkeleton> = { args: { label: "Loading Planner" } };
export const Content: StoryObj<typeof AppSkeleton> = { args: { fullPage: false } };
