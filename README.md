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

### UI Components

- `Button` - Primary button component with variants
- `Card` - Card container with header, content, footer
- `Input` - Text input field
- `Label` - Form label
- `Textarea` - Multi-line text input
- `Select` - Dropdown select component
- `Dialog` - Modal dialog
- `AlertDialog` - Confirmation dialog
- `Tabs` - Tab navigation

### Shared Components

- `LanguageSelector` - Language switcher pill component

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
```

## Publishing

The package is automatically published to GitHub Packages when you push a new tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

## License

MIT
