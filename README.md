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

`AppFooter` provides reusable attribution with an optional translated `text`.
`AlertModal` provides accessible feedback with host-owned `isOpen`, `title`,
`description`, `closeLabel` and `onClose`, using the existing alert-dialog
primitives rather than native JavaScript alerts. Each has its own Storybook entry.
`CommentGroups` accepts an optional `commentAction(group, category)` slot for
host-owned moderation controls; it does not persist or enforce permissions.
For split menus that open a modal, use `menuModal={false}` on `SplitButton` to
avoid overlapping modal focus/pointer locks. Other menus keep the existing default.

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

### Shared project navigation, authentication and loading

`PROJECTS` in `src/lib/projects.ts` is the single registry for project IDs,
names, icons and canonical URLs. Add a project there and release/update this
package in each consumer; no consumer-owned menu list is needed. Pass
`projectId="planner"`, `projectId="ladders"` or `projectId="pulse"` to `AppHeader` to enable its icon
dropdown. `getProjectUrl("planner")` also supplies cross-app vacation links.

Before creating a Supabase client, call `redirectAuthCallback(projectId)` and
skip client creation if it returns true (navigation is in progress). Pass
`getAuthRedirectUrl(projectId)` as `useSupabaseAuth`'s second argument. Signup,
OAuth and recovery then carry `auth_app` to their requesting origin. Only
registered apps can receive misplaced callbacks; arbitrary URLs are not accepted.
PKCE must be exchanged in the browser/origin where the flow began.

Then call `takeAuthCallback()` (still before the router renders, so a hash
router cannot swallow `#access_token=…`), create the client with
`detectSessionInUrl: false` and pass the result as `useSupabaseAuth`'s third
argument. It understands PKCE codes (`?code=`), implicit tokens
(`#access_token=…`, for example a recovery sent from the Supabase dashboard),
email token hashes (`?token_hash=…&type=…`, which work on any device) and link
errors. Each link is used once; recoveries open `passwordRecovery`, and links
that fail (expired, already used, or a PKCE link opened in another browser) are
reported as `linkError`, which the welcome page should show.

In Supabase **Authentication > URL Configuration**, allow each exact app URL
and its `?auth_app=...` callback (plus approved localhost URLs). Set a valid
Site URL, but do not rely on that single fallback for multiple apps.
Confirmation/recovery templates must use `{{ .RedirectTo }}` rather than
hard-coding `{{ .SiteURL }}` for their destination. Keep the generated
`{{ .ConfirmationURL }}` verification link intact. If using a custom link,
preserve `redirect_to` and verify the token through Supabase.
Old emails without an app parameter cannot reliably identify their source app;
request a new email after correcting the URL allow-list and templates.

`Skeleton` provides pulse placeholders (with reduced-motion support).
`AppSkeleton` includes an accessible loading status and a full app shell;
use `fullPage={false}` inside an already-rendered layout.

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
- `LanguageSelector`: selection callback with the shared `APP_LANGUAGES` (en, es, ca, fr, de, it) by default; pass `languages` to override
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
optional navigation row below the brand/language/account row. The subtitle is
optional, `leading` renders content such as a back button before the brand
icon, and `testId` overrides the default `header` test id. Both views are
presentation-only; consumers own routing, localization and authentication.

### Shared hooks

```tsx
import { useSupabaseAuth, useLoginForm } from "@jordiorriols/ui/hooks";
```

`useSupabaseAuth(client, redirectTo?, callback?)` takes an app-owned Supabase client and
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
adapter. The host app owns the website identifier and loads the tracker at boot
with `loadUmami({ websiteId })` instead of a `<script>` tag in `index.html`.

Automated browsers (Playwright, Selenium, Puppeteer…) set `navigator.webdriver`,
so `loadUmami` skips the tracker and the default sink drops every event: e2e runs
never reach Umami. `isAutomatedBrowser()` exposes the same check.

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

