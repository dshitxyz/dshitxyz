# @dshitxyz/ui

Shared React component library for dshit.xyz.

## Installation

This package is internal to the monorepo. It's automatically linked via pnpm workspaces.

## Usage

In any app or package:

```tsx
import { Button, Card, Alert } from "@dshitxyz/ui";

export function MyComponent() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  );
}
```

## Components

> Components documented in [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md)

- Button
- Card
- Alert
- StatBox
- More to come...

## Development

```bash
cd packages/ui

# Build
pnpm build

# Watch mode (for development)
pnpm typecheck

# Testing
pnpm test
```

## Guidelines

- All components must be TypeScript
- Follow Tailwind utility-first approach
- Export all components from `src/index.ts`
- Write stories for Storybook
- Include JSDoc comments

## Notes

- Uses Vite for fast builds
- React 18 compatible
- Fully typed with TypeScript
