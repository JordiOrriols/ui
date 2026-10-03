import { describe, expect, it } from "vitest";

type StoryModule = {
  default: { component?: unknown; render?: unknown; excludeStories?: string[] | RegExp };
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
