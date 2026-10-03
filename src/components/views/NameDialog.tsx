import type { useNameForm } from "../../hooks/useNameForm";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export function NameDialog({
  isOpen,
  onClose,
  form,
  labels,
  eventId,
}: {
  isOpen: boolean;
  onClose: () => void;
  form: ReturnType<typeof useNameForm>;
  eventId?: string;
  labels: { title: string; description: string; name: string; cancel: string; submit: string };
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent data-testid="team-name-dialog">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.submit();
          }}
          className="space-y-4"
        >
          <AlertDialogHeader>
            <AlertDialogTitle data-testid="team-name-dialog-title">{labels.title}</AlertDialogTitle>
            <AlertDialogDescription>{labels.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <Label htmlFor="team-name">{labels.name}</Label>
            <Input
              id="team-name"
              data-testid="team-name-input"
              value={form.name}
              onChange={(event) => form.setName(event.target.value)}
              maxLength={120}
              required
              autoFocus
              className="mt-1"
            />
          </div>
          {form.error && (
            <p role="alert" className="text-sm text-red-600">
              {form.error}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel type="button" data-testid="team-name-cancel">
              {labels.cancel}
            </AlertDialogCancel>
            <Button
              eventId={eventId}
              data-testid="team-name-submit"
              type="submit"
              disabled={form.disabled}
            >
              {labels.submit}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
