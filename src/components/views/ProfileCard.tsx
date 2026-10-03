import type { ComponentProps, ReactNode } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { UserAvatar } from "./indicators";

export interface ProfileCardProps {
  id: string;
  name: string;
  subtitle?: string;
  onEdit: () => void;
  onDelete: () => void;
  onClick?: () => void;
  readOnly?: boolean;
  draggable?: boolean;
  onDragStart?: ComponentProps<"div">["onDragStart"];
  children?: ReactNode;
  editLabel: string;
  deleteLabel: string;
}

export function ProfileCard({
  id,
  name,
  subtitle,
  onEdit,
  onDelete,
  onClick,
  readOnly = false,
  draggable = false,
  onDragStart,
  children,
  editLabel,
  deleteLabel,
}: ProfileCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all group ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      data-testid={`member-card-${id}`}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <UserAvatar label={name} />
          <div>
            <h3 className="font-semibold text-slate-800" data-testid="member-name">
              {name}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500" data-testid="member-role">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {!readOnly && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              eventId="member_card_edit"
              data-testid={`member-edit-${id}`}
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              aria-label={editLabel}
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
            >
              <Pencil className="w-4 h-4 text-slate-400" />
            </Button>
            <Button
              eventId="member_card_delete"
              data-testid={`member-delete-${id}`}
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              aria-label={deleteLabel}
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}
