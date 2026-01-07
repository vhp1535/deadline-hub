import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
  full: "sm:max-w-[90vw]",
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  showClose = true,
  className,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "glass-card-high border-border bg-card p-0 gap-0",
          sizeClasses[size],
          className
        )}
      >
        {(title || showClose) && (
          <DialogHeader className="p-6 pb-4 border-b border-border">
            <div className="flex items-start justify-between">
              <div>
                {title && (
                  <DialogTitle className="text-xl font-semibold text-foreground">
                    {title}
                  </DialogTitle>
                )}
                {description && (
                  <DialogDescription className="mt-1 text-muted-foreground">
                    {description}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>
        )}

        <div className="p-6">{children}</div>

        {footer && (
          <DialogFooter className="p-6 pt-4 border-t border-border">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Preset action buttons for common modal patterns
interface ModalActionsProps {
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  isLoading?: boolean;
  disabled?: boolean;
}

export function ModalActions({
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
  confirmVariant = "default",
  isLoading = false,
  disabled = false,
}: ModalActionsProps) {
  return (
    <div className="flex items-center gap-3 justify-end w-full">
      {onCancel && (
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          {cancelText}
        </Button>
      )}
      {onConfirm && (
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          disabled={disabled || isLoading}
        >
          {isLoading ? "Loading..." : confirmText}
        </Button>
      )}
    </div>
  );
}
