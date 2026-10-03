# @jordiorriols/ui

Shared UI components and design tokens for consistent design across projects.

## Installation

1. Create a `.npmrc` file in your project root:

```
@jordiorriols:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

2. Install the package:

```bash
npm install @jordiorriols/ui
```

## Usage

### Required: register the library as a Tailwind source

Tailwind skips `node_modules` when auto-detecting sources, so the class names
that live inside this package are never generated and components render
unstyled. Add a `@source` directive to your main CSS file, pointing at the
library's `dist` folder:

```css
@import "tailwindcss";
@source "./node_modules/@jordiorriols/ui/dist";
```

The path is relative to your main CSS file. If you keep it elsewhere, adjust it.

### Import Components

```tsx
import { Button, buttonVariants, cn, configureAnalytics } from "@jordiorriols/ui";

function MyComponent() {
  return <Button variant="outline" size="sm">Click me</Button>;
}
```

### Import Styles

Add the design tokens to your main CSS file:

```css
@import "tailwindcss";
@source "./node_modules/@jordiorriols/ui/dist";
@import "@jordiorriols/ui/styles";
```

Or import just the tokens:

```css
@import "@jordiorriols/ui/styles/tokens";
```

### Use Tailwind Preset (Optional)

```ts
// tailwind.config.ts
import { preset } from "@jordiorriols/ui/tailwind-preset";

export default {
  presets: [preset],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@jordiorriols/ui/dist/**/*.js",
  ],
};
```

## Components

### Official Radix primitives (unchanged)

```tsx
import { Accordion, Avatar, Dialog, Select, Toast } from "@jordiorriols/ui/radix";
import { User, Github } from "@jordiorriols/ui/icons";
```

The `radix` entry point re-exports every namespace from the official `radix-ui`
package, including upstream unstable exports. APIs, state, accessibility and
unstyled rendering remain upstream-owned. No custom primitive implementations
are introduced. `Radix` is also available as a namespace from the main entry point.
The `icons` entry point directly re-exports Lucide's named exports.

### Ladders-derived styled components

The original `Button` is unchanged. `Input`, `Label`, `AlertDialog` and `Tabs`
are copied from Ladders for visual compatibility, separately from direct Radix
exports. They are not substitutes for the entire Radix API.

- `LoginDialog`, `PasswordResetDialog`: presentation-only authentication views
- `ConfirmDialog`, `NameDialog`, `Modal`: reusable dialog layouts
- `EmptyState`: icon, translated text and action slots
- `SplitButton`, `ButtonGroup`: host-controlled actions and filters
- `LanguageSelector`: host-provided languages and selection callback
- `AppHeader`: branding and action slots
- `UserAvatar`, `Spinner`, `ProgressIndicator`, `StatusBadge`: display indicators
- `ProfileCard`, `RadarChart`, `CommentGroups`: data display without app-specific schemas
- `LevelSelector`: supplied options, summary, controlled values and local expansion
- `ShareAccessDialog`: supplied permission options and access entries
- `ReferenceDialog`: original Ladders reference layout with a content slot

Views take text and callbacks as props. They do not import an application router,
translation provider, database tables, repository, credentials or Supabase client.
Storybook gives each styled component and each of the 35 official Radix
namespaces its own sidebar entry. Demos exercise interaction where the primitive
supports it; inherently structural primitives show a focused rendering example.
Compound components such as AlertDialog and Tabs each have one entry, with their
exported parts documented through Storybook's `subcomponents` metadata rather
than fragment-only entries. The Storybook contract test checks the individual
entries, compound-part metadata and coverage for every styled component export
and official Radix namespace. When adding a component, add its example and
metadata in the same change.

Demo-only styles supply geometry for unstyled Radix sliders, scrollbars, dialogs
and toasts without modifying the official exports. The one-time-password demo
uses six inputs and displays the complete controlled code; the toast can be
reopened after dismissal. Rendering and interaction regressions are checked in
addition to the metadata contracts.

`WelcomeScreen` is the shared Planner-style welcome view: inject branding,
feature descriptions, translated action labels and authentication callbacks.
`AppHeader` standardizes title/subtitle and icon sizes, account actions and an
optional navigation row below the brand/language/account row. Both views are
presentation-only; consumers own routing, localization and authentication.

### Shared hooks

```tsx
import { useSupabaseAuth, useLoginForm } from "@jordiorriols/ui/hooks";
```

`useSupabaseAuth(client, redirectTo?)` takes an app-owned Supabase client and
provides session restoration, auth subscriptions, password/GitHub sign-in,
sign-up, recovery, password updates and sign-out. The default redirect is the
current origin and pathname, as in Ladders. Configure a redirect explicitly for
other deployments. No application tables are queried.

`useLoginForm`, `usePasswordResetForm` and `useNameForm` provide form/action
logic separately from the views. `useAsyncAction` surfaces operation failures
and ignores completions from cancelled/reset/unmounted forms. Session restoration
errors are exposed as `authError`; consumers must render them. Unconfigured
authentication rejects actions rather than reporting a false success.
`useShareAccessForm` runs host-provided invitation, access-change and removal
callbacks without knowing any tables or assuming specific permission values.
`ReferenceDialog` deliberately preserves the original reference layout and
Escape/overlay behavior; use the Radix-backed `Modal` for new generic dialogs.

Umami analytics already uses the shared `configureAnalytics` / `trackEvent`
adapter. The host app owns the Umami script and website identifier.

### Local development across sibling projects

Build this package first, then install it in each app:

```bash
cd ../ui && npm run build
cd ../ladders
npm uninstall @jordiorriols/ui --ignore-scripts
npm install ../ui --install-links --ignore-scripts
cd ../planner
npm uninstall @jordiorriols/ui --ignore-scripts
npm install ../ui --install-links --ignore-scripts
```

Both consumers use `file:../ui` with `install-links=true` in their npm
configuration. This installs the package without symlinking the library's
development React into the app, avoiding duplicate-React hook errors (including
Radix's CommonJS dependencies). Remove and reinstall after changing the shared
package without bumping its version; `npm install` alone can retain the old copy.

Both apps import `@jordiorriols/ui/styles/tokens`; change shared colors and
radii here instead of duplicating token declarations in the apps. Keep their
Tailwind source directives so all library utility classes are generated.
Do not publish or push merely to validate local changes.

## Design Tokens

The package includes CSS custom properties for:

- **Colors**: Background, foreground, primary, secondary, muted, accent, destructive
- **Border radius**: Consistent rounded corners (`--radius: 0.625rem`)
- **Typography**: Open Sans font family
- **Dark mode**: Full dark mode support with `.dark` class

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Type check
npm run typecheck

# Type check Storybook stories and preview (excluded by the library tsconfig)
npx tsc --noEmit -p .storybook/tsconfig.json

# Storybook metadata, rendering and interaction tests
npm test -- src/storybook.test.ts src/storybook-rendering.test.tsx

# Build the standalone Storybook
npm run build-storybook
```

## Publishing

The package is automatically published to GitHub Packages when you push a new tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

## License

MIT
