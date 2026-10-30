export function getDisplayName({
  memberName,
  accountName,
  email,
}: {
  memberName?: string | null;
  accountName?: unknown;
  email: string;
}): string {
  return (
    memberName?.trim() ||
    (typeof accountName === "string" && accountName.trim()) ||
    email.split("@")[0].trim()
  );
}
