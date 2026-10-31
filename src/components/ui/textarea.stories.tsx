import { Textarea } from "./textarea";

export default { title: "Components/Textarea", component: Textarea, tags: ["autodocs"] };
export const Default = { args: { "aria-label": "Notes", placeholder: "What changed?" } };
export const Disabled = {
  args: { "aria-label": "Notes", defaultValue: "Published notes", disabled: true },
};
export const Invalid = {
  args: { "aria-label": "Notes", "aria-invalid": true, defaultValue: "Too short" },
};
