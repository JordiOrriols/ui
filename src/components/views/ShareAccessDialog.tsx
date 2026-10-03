import { Trash2 } from "lucide-react";
import type { useShareAccessForm } from "../../hooks/useShareAccessForm";
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

export interface AccessEntry<T extends string> {
  id: string;
  email: string;
  access: T;
}

export function ShareAccessDialog<T extends string>({
  isOpen,
  onClose,
  entries,
  options,
  form,
  loading = false,
  labels,
}: {
  isOpen: boolean;
  onClose: () => void;
  entries: AccessEntry<T>[];
  options: { value: T; label: string }[];
  form: ReturnType<typeof useShareAccessForm<T>>;
  loading?: boolean;
  labels: {
    title: string;
    description: string;
    email: string;
    permission: string;
    share: string;
    loading: string;
    empty: string;
    close: string;
    permissionFor: (email: string) => string;
    remove: (email: string) => string;
  };
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-2xl" data-testid="share-team-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>{labels.title}</AlertDialogTitle>
          <AlertDialogDescription>{labels.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.submit();
          }}
          className="grid gap-3 sm:grid-cols-[1fr_140px_auto]"
        >
          <div>
            <Label htmlFor="share-email">{labels.email}</Label>
            <Input
              id="share-email"
              data-testid="share-email-input"
              type="email"
              value={form.email}
              onChange={(event) => form.setEmail(event.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="share-access">{labels.permission}</Label>
            <select
              id="share-access"
              data-testid="share-access-select"
              value={form.access}
              onChange={(event) => {
                const option = options.find((item) => item.value === event.target.value);
                if (option) form.setAccess(option.value);
              }}
              className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <Button
            eventId="team_share_add"
            data-testid="share-team-submit"
            type="submit"
            disabled={form.busy || !form.email.trim()}
            className="self-end"
          >
            {labels.share}
          </Button>
        </form>
        {form.error && (
          <p role="alert" data-testid="share-error" className="text-sm text-red-600">
            {form.error}
          </p>
        )}
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-slate-500">{labels.loading}</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-slate-500">{labels.empty}</p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                data-testid="share-row"
                className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2"
              >
                <span className="min-w-0 flex-1 truncate text-sm text-slate-700">
                  {entry.email}
                </span>
                <select
                  data-testid="share-row-access"
                  aria-label={labels.permissionFor(entry.email)}
                  value={entry.access}
                  disabled={form.busy}
                  onChange={(event) => {
                    const option = options.find((item) => item.value === event.target.value);
                    if (option) void form.changeAccess(entry.id, option.value);
                  }}
                  className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs"
                >
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Button
                  eventId="team_share_remove"
                  data-testid="share-row-remove"
                  variant="ghost"
                  size="icon-sm"
                  disabled={form.busy}
                  onClick={() => void form.remove(entry.id)}
                  aria-label={labels.remove(entry.email)}
                  type="button"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{labels.close}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
