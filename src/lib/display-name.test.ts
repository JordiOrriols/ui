import { describe, expect, it } from "vitest";
import { getDisplayName } from "./display-name";

describe("getDisplayName", () => {
  it("prefers the workspace member name, then account name, then email local part", () => {
    expect(
      getDisplayName({ memberName: " Ada ", accountName: "Account", email: "ada@example.com" })
    ).toBe("Ada");
    expect(
      getDisplayName({ memberName: " ", accountName: " Grace ", email: "ada@example.com" })
    ).toBe("Grace");
    expect(getDisplayName({ accountName: "", email: "ada.lovelace@example.com" })).toBe(
      "ada.lovelace"
    );
    expect(getDisplayName({ email: "user+tag@example.com" })).toBe("user+tag");
  });
});
