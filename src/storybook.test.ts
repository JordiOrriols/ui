import { describe, expect, it } from "vitest";
import * as components from "./components";
import * as radix from "./radix";

type StoryModule = {
  default: {
    title?: string;
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
  const storyModules = Object.values(modules);
  const documentedComponents = new Set(
    storyModules.flatMap((module) => [
      module.default.component,
      ...Object.values(module.default.subcomponents ?? {}),
    ])
  );
  const compoundParts = new Set([
    "AlertDialogAction",
    "AlertDialogCancel",
    "AlertDialogContent",
    "AlertDialogDescription",
    "AlertDialogFooter",
    "AlertDialogHeader",
    "AlertDialogTitle",
    "AlertDialogTrigger",
    "TabsContent",
    "TabsList",
    "TabsTrigger",
  ]);

  for (const [name, component] of Object.entries(components)) {
    if (name === "buttonVariants") continue;
    it(`${name} has Storybook metadata and examples`, () => {
      expect(documentedComponents.has(component)).toBe(true);
    });

    if (!compoundParts.has(name)) {
      it(`${name} has its own sidebar entry`, () => {
        expect(storyModules.some((module) => module.default.component === component)).toBe(true);
      });
    }
  }

  for (const name of compoundParts) {
    const component = components[name as keyof typeof components];
    it(`${name} is documented as a compound part, not a standalone entry`, () => {
      expect(documentedComponents.has(component)).toBe(true);
      expect(
        storyModules.some(
          (module) =>
            module.default.component !== undefined && module.default.component === component
        )
      ).toBe(false);
    });
  }

  it("assigns every story module a distinct sidebar title", () => {
    const titles = storyModules.map((module) => module.default.title);
    expect(titles.every((title) => typeof title === "string" && title.length > 0)).toBe(true);
    expect(new Set(titles).size).toBe(storyModules.length);
  });

  for (const name of Object.keys(radix)) {
    it(`${name} has an official Radix story`, () => {
      const storyName = name.replace(/^unstable_/, "");
      const path = `./radix-stories/${storyName}.stories.tsx`;
      const module = modules[path];
      expect(module, `Missing dedicated Storybook module at ${path}`).toBeDefined();
      expect(module?.default.title).toBe(`Radix/${storyName}`);
      expect(module?.Interactive).toEqual(
        expect.objectContaining({ render: expect.any(Function) })
      );
    });
  }

  it("has one dedicated sidebar entry for each official Radix namespace", () => {
    const radixEntries = storyModules.filter((module) =>
      module.default.title?.startsWith("Radix/")
    );
    expect(radixEntries).toHaveLength(Object.keys(radix).length);
  });
});
