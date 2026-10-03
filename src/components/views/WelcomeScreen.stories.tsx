import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calculator, CalendarDays, GanttChartSquare } from "lucide-react";
import { useState } from "react";
import { WelcomeScreen } from "./WelcomeScreen";

const meta = {
  title: "Views/WelcomeScreen",
  component: WelcomeScreen,
  args: {
    brand: "Cadence / Planner",
    icon: <GanttChartSquare />,
    title: "Make room for the work ahead.",
    description:
      "Estimate microprojects, plan around real squad capacity, and keep everyone's time off in view.",
    features: [
      { icon: <Calculator />, label: "Role-based estimates" },
      { icon: <GanttChartSquare />, label: "A realistic backlog" },
      { icon: <CalendarDays />, label: "Barcelona calendar" },
    ],
    signInLabel: "Sign in",
    signUpLabel: "Create account",
    onSignIn: () => {},
    onSignUp: () => {},
  },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof WelcomeScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function WelcomeDemo(args) {
    const [mode, setMode] = useState("");
    return (
      <WelcomeScreen
        {...args}
        onSignIn={() => setMode("Sign in requested")}
        onSignUp={() => setMode("Create account requested")}
      >
        {mode && <p role="status">{mode}</p>}
      </WelcomeScreen>
    );
  },
};
export const Unavailable: Story = {
  args: {
    disabled: true,
    notice: <p role="alert">Account access is not configured for this deployment.</p>,
  },
};
