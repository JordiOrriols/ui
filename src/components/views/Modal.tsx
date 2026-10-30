import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { buttonVariants } from "../ui/button";

export function Modal({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  closeLabel,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children?: ReactNode;
  footer?: ReactNode;
  closeLabel: string;
}) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="bg-background fixed top-[50%] left-[50%] z-50 flex max-h-[70dvh] w-full max-w-[min(712px,calc(100%-2rem))] translate-x-[-50%] translate-y-[-50%] flex-col gap-4 rounded-lg border p-6 shadow-lg">
          <div className="flex shrink-0 flex-col gap-2 text-center sm:text-left">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            <Dialog.Description className="text-muted-foreground text-sm">
              {description}
            </Dialog.Description>
          </div>
          <div className="min-h-0 overflow-y-auto">{children}</div>
          <div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Dialog.Close className={buttonVariants({ variant: "outline" })}>
              {closeLabel}
            </Dialog.Close>
            {footer}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
