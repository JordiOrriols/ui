import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorState } from "./ErrorState";

export default {
  title: "Views/ErrorState",
  component: ErrorState,
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorState>;

export const Default: StoryObj<typeof ErrorState> = {
  args: { title: "Unable to load", message: "The request failed. Try again later." },
};
export const Retry: StoryObj<typeof ErrorState> = {
  args: { message: "Unable to load this workspace.", retryLabel: "Retry", onRetry: () => {} },
};
export const Busy: StoryObj<typeof ErrorState> = {
  args: {
    message: "Unable to load this workspace.",
    retryLabel: "Retry",
    onRetry: () => {},
    retryDisabled: true,
  },
};
