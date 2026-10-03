import { describe, expect, it } from "vitest";
import * as components from "./components";
import * as radix from "./radix";
import * as radixStories from "./radix.stories";

type StoryModule = {
  default: {
    component?: unknown;
    subcomponents?: Record<string, unknown>;
    render?: unknown;
    excludeStories?: string[] | RegExp;
  };
  [name: string]: unknown;
};
const modules = import.meta.glob<StoryModule>("./**/*.stories.tsx", { eager: true });

describe("Storybook export contracts", () => {
  for (const [path, module] of Object.entries(modules)) {
    for (const [name, story] of Object.entries(module)) {
      const excluded = module.default.excludeStories;
      if (
        name === "default" ||
        (Array.isArray(excluded) ? excluded.includes(name) : excluded?.test(name))
      )
        continue;
      it(`${path}: ${name} is a renderable story, not an accidental fixture export`, () => {
        expect(story).toBeTypeOf("object");
        if (typeof story !== "object" || story === null) throw new Error("Invalid story export");
        expect(
          !!module.default.component ||
            typeof module.default.render === "function" ||
            ("render" in story && typeof story.render === "function")
        ).toBe(true);
      });
    }
  }
});

describe("Storybook component coverage", () => {
  const documentedComponents = new Set(
    Object.values(modules).flatMap((module) => [
      module.default.component,
      ...Object.values(module.default.subcomponents ?? {}),
    ])
  );

  for (const [name, component] of Object.entries(components)) {
    if (name === "buttonVariants") continue;
    it(`${name} has Storybook component metadata and examples`, () => {
      expect(documentedComponents.has(component)).toBe(true);
    });
  }

  for (const name of Object.keys(radix)) {
    it(`${name} has an official Radix story`, () => {
      const storyName = name.replace(/^unstable_/, "");
      expect(radixStories).toHaveProperty(storyName);
    });
  }
});
