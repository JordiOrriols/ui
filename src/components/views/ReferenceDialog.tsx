import { useEffect, type ReactNode } from "react";
import { Button } from "../ui/button";

export function ReferenceDialog({
  isOpen,
  onClose,
  title,
  closeLabel,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-8"
      onClick={onClose}
    >
      <div
        className="bg-white flex max-h-[70dvh] flex-col rounded-2xl shadow-2xl w-full max-w-[968px] mx-4"
        data-testid="reference-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
          <Button
            eventId="reference_modal_close"
            data-testid="reference-modal-close"
            size="icon"
            variant="ghost"
            aria-label={closeLabel}
            onClick={onClose}
          >
            <span className="text-xl">&times;</span>
          </Button>
        </div>
        <div className="min-h-0 p-6 overflow-y-auto space-y-6" data-testid="reference-modal-body">
          {children}
        </div>
        <div className="shrink-0 p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
          <Button eventId="reference_modal_close_footer" onClick={onClose} className="w-full">
            {closeLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
