import { TrendingUp, GanttChartSquare, HeartPulse, Rocket } from "lucide-react";

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
  {
    id: "shiplog",
    name: "Shiplog",
    url: "https://shiplog.jordiorriols.cat/",
    icon: Rocket,
  },
] as const;

export type ProjectId = (typeof PROJECTS)[number]["id"];

export function getProjectUrl(id: ProjectId): string {
  const project = PROJECTS.find((item) => item.id === id);
  if (!project) throw new Error(`Unknown project: ${id}`);
  return project.url;
}
