import { LogIn, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { getProject, type ProjectId } from "../../lib/projects";

export interface AccountButtonProps {
  type: "signIn" | "signOut";
  label: string;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  projectId?: ProjectId;
}

export function AccountButton({
  type,
  label,
  onClick,
  disabled,
  title,
  projectId,
}: AccountButtonProps) {
  return (
    <Button
      eventId={`header_${type === "signIn" ? "sign_in" : "sign_out"}`}
      variant={type === "signIn" ? "outline" : "ghost"}
      size="sm"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      title={title}
      data-testid={type === "signIn" ? "sign-in-button" : "sign-out-button"}
    >
      {type === "signIn" ? (
        <LogIn
          className="size-4"
          aria-hidden="true"
          style={projectId ? { color: getProject(projectId).color } : undefined}
        />
      ) : (
        <LogOut className="size-4" />
      )}
      <span className="hidden md:inline">{label}</span>
    </Button>
  );
}
