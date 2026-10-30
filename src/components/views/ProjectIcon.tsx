import type { LucideProps } from "lucide-react";
import { getProject, type ProjectId } from "../../lib/projects";

export function ProjectIcon({
  projectId,
  style,
  ...props
}: LucideProps & { projectId: ProjectId }) {
  const project = getProject(projectId);
  const Icon = project.icon;
  return <Icon {...props} style={{ ...style, color: project.color }} />;
}
