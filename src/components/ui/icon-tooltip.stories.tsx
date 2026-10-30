import { Pencil, ThumbsUp, Trash2 } from "lucide-react";
import { Button } from "./button";
import { IconTooltip } from "./icon-tooltip";

export default { title: "Components/IconTooltip", component: IconTooltip, tags: ["autodocs"] };
export const Actions = {
  render: () => (
    <div className="flex items-center gap-2 p-12">
      <Button size="icon-sm" variant="ghost" aria-label="Edit">
        <Pencil />
      </Button>
      <Button size="icon-sm" variant="ghost" aria-label="Delete">
        <Trash2 />
      </Button>
      <Button size="icon-sm" variant="ghost" aria-label="Approve">
        <ThumbsUp />
      </Button>
    </div>
  ),
};
