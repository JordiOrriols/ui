import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutGrid } from "lucide-react";
import { AppHeader } from "./AppHeader";
import { LanguageSelector } from "./LanguageSelector";

const meta = {
  title: "Views/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

function HeaderExample() {
  const [language, setLanguage] = useState("en");
  return (
    <AppHeader
      title="Your application"
      subtitle="Your subtitle"
      icon={<LayoutGrid className="h-5 w-5 text-white" />}
      actions={
        <LanguageSelector
          languages={[
            { code: "en", short: "EN", label: "English" },
            { code: "es", short: "ES", label: "Spanish" },
          ]}
          value={language}
          onValueChange={setLanguage}
          label="Language"
        />
      }
    />
  );
}

export const WithActions: Story = { render: () => <HeaderExample /> };
