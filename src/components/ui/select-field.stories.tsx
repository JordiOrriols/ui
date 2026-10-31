import { SelectField } from "./select-field";

export default { title: "Components/SelectField", component: SelectField, tags: ["autodocs"] };
export const Default = {
  args: {
    "aria-label": "Release status",
    defaultValue: "draft",
    options: [
      { value: "draft", label: "Draft" },
      { value: "qa", label: "QA" },
      { value: "released", label: "Released" },
    ],
  },
};
export const EmptyChoice = {
  args: {
    "aria-label": "Application",
    options: [
      { value: "", label: "All applications" },
      { value: "website", label: "Website" },
    ],
  },
};
export const StatusIndicators = {
  args: {
    "aria-label": "Permission",
    defaultValue: "",
    options: [
      { value: "", label: "No access", indicatorClassName: "bg-slate-400" },
      { value: "viewer", label: "Viewer", indicatorClassName: "bg-blue-500" },
      { value: "editor", label: "Editor", indicatorClassName: "bg-emerald-600" },
    ],
  },
};
