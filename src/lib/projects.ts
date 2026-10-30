import { TrendingUp, GanttChartSquare, HeartPulse, Rocket } from "lucide-react";

export const PROJECTS = [
  {
    id: "ladders",
    name: "Ladders",
    url: "https://ladders.jordiorriols.cat/",
    icon: TrendingUp,
    color: "#3b82f6",
    backgroundColor: "#3b82f61a",
  },
  {
    id: "planner",
    name: "Planner",
    url: "https://planner.jordiorriols.cat/",
    icon: GanttChartSquare,
    color: "#10b981",
    backgroundColor: "#10b9811a",
  },
  {
    id: "pulse",
    name: "Pulse",
    url: "https://pulse.jordiorriols.cat/",
    icon: HeartPulse,
    color: "#a855f7",
    backgroundColor: "#a855f71a",
  },
  {
    id: "shiplog",
    name: "Shiplog",
    url: "https://shiplog.jordiorriols.cat/",
    icon: Rocket,
    color: "#f59e0b",
    backgroundColor: "#f59e0b1a",
  },
] as const;

export type ProjectId = (typeof PROJECTS)[number]["id"];

export function getProject(id: ProjectId) {
  const project = PROJECTS.find((item) => item.id === id);
  if (!project) throw new Error(`Unknown project: ${id}`);
  return project;
}

export function getProjectUrl(id: ProjectId): string {
  return getProject(id).url;
}
