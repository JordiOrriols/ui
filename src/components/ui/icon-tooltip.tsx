import type { ReactElement } from "react";
import { Tooltip } from "radix-ui";

export function IconTooltip({ label, children }: { label: string; children: ReactElement }) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={6}
            className="z-[110] max-w-64 rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-md"
          >
            {label}
            <Tooltip.Arrow className="fill-foreground" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
