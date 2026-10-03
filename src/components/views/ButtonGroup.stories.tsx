import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonGroup } from "./ButtonGroup";

const meta = {
  title: "Views/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj;

function Filters() {
  const [values, setValues] = useState(["one"]);
  return (
    <ButtonGroup
      label="Filters"
      items={["one", "two", "three"].map((value) => ({
        value,
        label: value,
        selected: values.includes(value),
      }))}
      onToggle={(value) =>
        setValues((previous) =>
          previous.includes(value)
            ? previous.filter((item) => item !== value)
            : [...previous, value]
        )
      }
    />
  );
}

export const InteractiveFilters: Story = { render: () => <Filters /> };
