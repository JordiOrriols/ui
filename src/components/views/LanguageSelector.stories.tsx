import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LanguageSelector } from "./LanguageSelector";

const meta = {
  title: "Views/LanguageSelector",
  component: LanguageSelector,
  tags: ["autodocs"],
} satisfies Meta<typeof LanguageSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

function LanguageMenu() {
  const [value, setValue] = useState("en");
  return (
    <LanguageSelector
      languages={[
        { code: "en", short: "EN", label: "English" },
        { code: "es", short: "ES", label: "Spanish" },
      ]}
      value={value}
      onValueChange={setValue}
      label="Language"
      className="inline-flex"
    />
  );
}

export const Interactive: Story = { render: () => <LanguageMenu /> };
