import { describe, expect, it } from "vitest";
import { getAuthCallbackDestination, getAuthRedirectUrl } from "./authRedirect";

describe("app-scoped authentication redirects", () => {
  it("keeps the requesting app origin and deployment path, including local development", () => {
    expect(
      getAuthRedirectUrl("planner", "https://planner.jordiorriols.cat/?old=true#/roadmap")
    ).toBe("https://planner.jordiorriols.cat/?auth_app=planner");
    expect(getAuthRedirectUrl("ladders", "http://localhost:5173/tools/ladders/#/team")).toBe(
      "http://localhost:5173/tools/ladders/?auth_app=ladders"
    );
  });
  it("routes misplaced PKCE callbacks before exchanging a code on the wrong origin", () => {
    expect(
      getAuthCallbackDestination(
        "ladders",
        "https://ladders.jordiorriols.cat/?auth_app=planner&code=test"
      )
    ).toBe("https://planner.jordiorriols.cat/?auth_app=planner&code=test");
    expect(
      getAuthCallbackDestination(
        "planner",
        "https://planner.jordiorriols.cat/?auth_app=pulse&code=test"
      )
    ).toBe("https://pulse.jordiorriols.cat/?auth_app=pulse&code=test");
    expect(
      getAuthCallbackDestination(
        "planner",
        "https://planner.jordiorriols.cat/?auth_app=ladders#access_token=test&type=recovery"
      )
    ).toBe("https://ladders.jordiorriols.cat/?auth_app=ladders#access_token=test&type=recovery");
  });
  it("does not redirect normal navigation, same-app callbacks or legacy links without an app", () => {
    for (const url of [
      "https://planner.jordiorriols.cat/?auth_app=planner&code=test",
      "https://planner.jordiorriols.cat/?auth_app=ladders",
      "https://planner.jordiorriols.cat/?code=test",
    ])
      expect(getAuthCallbackDestination("planner", url)).toBeNull();
  });
  it("does not allow arbitrary redirect hosts or forward tokens to unregistered apps", () => {
    expect(() =>
      getAuthCallbackDestination(
        "planner",
        "https://planner.jordiorriols.cat/?auth_app=https://evil.example&code=test"
      )
    ).toThrow("Unknown authentication destination");
    expect(
      getAuthCallbackDestination(
        "planner",
        "https://planner.jordiorriols.cat/?redirect_to=https://evil.example&code=test"
      )
    ).toBeNull();
  });
});
