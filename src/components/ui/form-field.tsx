import { useId, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Label } from "./label";

export interface FormFieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid": boolean;
}

export interface FormFieldProps {
  id?: string;
  label: ReactNode;
  description?: string;
  error?: string;
  "aria-describedby"?: string;
  className?: string;
  children: (props: FormFieldControlProps) => ReactNode;
}

export function FormField({
  id,
  label,
  description,
  error,
  "aria-describedby": describedBy,
  className,
  children,
}: FormFieldProps) {
  const generatedId = useId();
  const controlId = id ?? `field-${generatedId}`;
  const descriptionId = `${controlId}-description`;
  const errorId = `${controlId}-error`;
  const descriptions =
    [describedBy, description && descriptionId, error && errorId].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div data-slot="form-field" className={cn("space-y-2", className)}>
      <Label htmlFor={controlId}>{label}</Label>
      {children({
        id: controlId,
        "aria-describedby": descriptions,
        "aria-invalid": !!error,
      })}
      {description && (
        <p id={descriptionId} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
