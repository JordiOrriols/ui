import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

export interface ModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: React.ReactNode;
  /** Modal subtitle/description */
  subtitle?: React.ReactNode;
  /** Modal content */
  children?: React.ReactNode;
  /** Additional CSS classes for the modal container */
  className?: string;
  /** Max width class */
  maxWidth?: string;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Whether clicking the overlay closes the modal */
  closeOnOverlayClick?: boolean;
}

function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  className,
  maxWidth = "max-w-lg",
  showCloseButton = true,
  closeOnOverlayClick = true,
}: ModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // Handle escape key
  React.useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    closeButtonRef.current?.focus();

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 animate-in fade-in-0"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={cn(
          "relative bg-background rounded-xl border shadow-lg w-full animate-in fade-in-0 zoom-in-95",
          "max-h-[90vh] overflow-hidden flex flex-col",
          maxWidth,
          className
        )}
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            aria-label="Close modal"
          >
            <X className="size-4 text-muted-foreground" aria-hidden="true" />
          </button>
        )}

        {/* Header */}
        {(title || subtitle) && (
          <div className="p-6 pb-0">
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-semibold text-foreground pr-8"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 px-6 pb-6 pt-0 sm:flex-row sm:justify-end",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Modal, ModalFooter };
