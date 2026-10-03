import { describe, expect, it } from "vitest";
import * as official from "radix-ui";
import * as exported from "./radix";
import * as officialIcons from "lucide-react";
import * as icons from "./icons";

describe("direct upstream exports", () => {
  it("exports every Radix namespace without wrapping or modifying it", () => {
    expect(Object.keys(exported).sort()).toEqual(Object.keys(official).sort());
    for (const key of Object.keys(official) as (keyof typeof official)[]) {
      expect(exported[key]).toBe(official[key]);
    }
  });
  it("exports the upstream icon library unchanged", () => {
    expect(Object.keys(icons).sort()).toEqual(
      Object.keys(officialIcons)
        .filter((key) => key !== "default")
        .sort()
    );
    expect(icons.User).toBe(officialIcons.User);
    expect(icons.Github).toBe(officialIcons.Github);
  });
});
