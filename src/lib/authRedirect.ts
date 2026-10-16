import { getProjectUrl, PROJECTS, type ProjectId } from "./projects";

const APP_PARAMETER = "auth_app";

export function getAuthRedirectUrl(project: ProjectId, currentUrl = window.location.href): string {
  const url = new URL(currentUrl);
  url.search = "";
  url.hash = "";
  url.searchParams.set(APP_PARAMETER, project);
  return url.href;
}

export function getAuthCallbackDestination(project: ProjectId, currentUrl: string): string | null {
  const url = new URL(currentUrl);
  const target = url.searchParams.get(APP_PARAMETER);
  const callback =
    url.searchParams.has("code") ||
    url.searchParams.has("error") ||
    /(?:^#|&)access_token=|(?:^#|&)error=/.test(url.hash);
  if (!target || target === project || !callback) return null;
  const registered = PROJECTS.find((item) => item.id === target);
  if (!registered) throw new Error("Unknown authentication destination");
  const destination = new URL(getProjectUrl(registered.id));
  destination.search = url.search;
  destination.hash = url.hash;
  return destination.href;
}

// Run before creating the Supabase client so the intended origin exchanges PKCE codes.
export function redirectAuthCallback(project: ProjectId): boolean {
  const destination = getAuthCallbackDestination(project, window.location.href);
  if (!destination) return false;
  window.location.replace(destination);
  return true;
}
