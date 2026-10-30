import type { Meta, StoryObj } from "@storybook/react-vite";
import { PROJECTS } from "../../lib/projects";
import { ProjectIcon } from "./ProjectIcon";
import { AppHeader } from "./AppHeader";
import { WelcomeScreen } from "./WelcomeScreen";

const meta = {
  title: "Views/ProjectIcon",
  component: ProjectIcon,
  args: { projectId: "ladders", size: 32, "aria-label": "Project brand" },
  argTypes: {
    projectId: { control: "select", options: PROJECTS.map((project) => project.id) },
  },
} satisfies Meta<typeof ProjectIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Palette: Story = {
  render: () => (
    <div className="space-y-4">
      {["#ffffff", "#09090b"].map((backgroundColor) => (
        <div
          key={backgroundColor}
          className="grid grid-cols-2 gap-3 rounded-xl p-4"
          style={{ backgroundColor }}
        >
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-3 rounded-xl p-5"
              style={{ backgroundColor: project.backgroundColor, color: project.color }}
            >
              <ProjectIcon projectId={project.id} size={32} aria-hidden="true" />
              <span className="font-semibold">{project.name}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const HeaderAndLogin: Story = {
  render: ({ projectId }) => (
    <>
      <AppHeader
        title={PROJECTS.find((project) => project.id === projectId)!.name}
        projectId={projectId}
        accountAction={{ type: "signIn", label: "Sign in", onClick: () => {} }}
      />
      <WelcomeScreen
        brand={PROJECTS.find((project) => project.id === projectId)!.name}
        projectId={projectId}
        icon={null}
        title="Welcome back."
        description="Shared account access with your application's own identity."
        features={[]}
        signInLabel="Sign in"
        signUpLabel="Create account"
        onSignIn={() => {}}
        onSignUp={() => {}}
      />
    </>
  ),
  parameters: { layout: "fullscreen" },
};

export const Planner: Story = { ...HeaderAndLogin, args: { projectId: "planner" } };
export const Pulse: Story = { ...HeaderAndLogin, args: { projectId: "pulse" } };
export const Shiplog: Story = { ...HeaderAndLogin, args: { projectId: "shiplog" } };
