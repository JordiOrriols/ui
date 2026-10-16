import { TrendingUp, GanttChartSquare, HeartPulse } from "lucide-react";

export const PROJECTS = [
  {
    id: "ladders",
    name: "Ladders",
    url: "https://ladders.jordiorriols.cat/",
    icon: TrendingUp,
  },
  {
    id: "planner",
    name: "Planner",
    url: "https://planner.jordiorriols.cat/",
    icon: GanttChartSquare,
  },
  {
    id: "pulse",
    name: "Pulse",
    url: "https://pulse.jordiorriols.cat/",
    icon: HeartPulse,
  },
] as const;

export type ProjectId = (typeof PROJECTS)[number]["id"];

export function getProjectUrl(id: ProjectId): string {
  const project = PROJECTS.find((item) => item.id === id);
  if (!project) throw new Error(`Unknown project: ${id}`);
  return project.url;
}
