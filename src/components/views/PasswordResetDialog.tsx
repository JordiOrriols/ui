import type { usePasswordResetForm } from "../../hooks/usePasswordResetForm";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export function PasswordResetDialog({
  isOpen,
  form,
  labels,
}: {
  isOpen: boolean;
  form: ReturnType<typeof usePasswordResetForm>;
  labels: {
    title: string;
    description: string;
    newPassword: string;
    confirmPassword: string;
    updatePassword: string;
  };
}) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.submit();
          }}
          className="space-y-4"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>{labels.title}</AlertDialogTitle>
            <AlertDialogDescription>{labels.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="new-password">{labels.newPassword}</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
                value={form.password}
                onChange={(event) => form.setPassword(event.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">{labels.confirmPassword}</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={form.confirmation}
                onChange={(event) => form.setConfirmation(event.target.value)}
                className="mt-1"
              />
            </div>
            {form.error && (
              <p role="alert" className="text-sm text-red-600">
                {form.error}
              </p>
            )}
          </div>
          <AlertDialogFooter>
            <Button eventId="auth_update_password" type="submit" disabled={form.busy}>
              {labels.updatePassword}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
