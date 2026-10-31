import * as React from "react";
import { Checkbox as Primitive } from "radix-ui";
import { Check, Minus } from "lucide-react";
import { cn } from "../../lib/utils";

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof Primitive.Root>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root>
>(function Checkbox({ className, ...props }, ref) {
  return (
    <Primitive.Root
      ref={ref}
      data-slot="checkbox"
      className={cn(
        "peer inline-flex size-4 shrink-0 items-center justify-center rounded border border-input bg-background shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <Primitive.Indicator className="flex items-center justify-center">
        <Check className="size-3.5 [[data-state=indeterminate]>&]:hidden" aria-hidden="true" />
        <Minus
          className="hidden size-3.5 [[data-state=indeterminate]>&]:block"
          aria-hidden="true"
        />
      </Primitive.Indicator>
    </Primitive.Root>
  );
});
