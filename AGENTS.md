# AGENTS.md - Agentic Coding Guidelines

## Project Overview

This is a **Nuxt 3** + **Vue 3** application called "Random Generator" (随机生成器) - a feature-rich random generator supporting random numbers, food selection, and movie recommendations. Uses TypeScript, UnoCSS for styling, and Antfu's ESLint config.

## Attention
Use skills!!

## Tech Stack

- **Framework**: Nuxt 3.15.4 with Vue 3.5.13
- **Language**: TypeScript 5.7.3
- **Styling**: UnoCSS (65.4.3) + @unocss/reset/tailwind.css
- **UI Components**: Vue Sonner for toasts
- **Icons**: Iconify (via UnoCSS preset-icons)
- **Linting**: ESLint 9 with @antfu/eslint-config

## Build/Lint/Test Commands

```bash
# Development
pnpm dev              # Start dev server

# Build
pnpm build            # Build for production
pnpm generate         # Generate static site
pnpm preview          # Preview production build

# Linting (CRITICAL - must pass)
pnpm lint             # Check linting
pnpm lint:fix         # Fix linting issues

# Type checking (via nuxt prepare)
pnpm postinstall      # Prepare nuxt (runs type generation)
```

**Note**: There are currently no test files or test commands configured.

## Code Style Guidelines

### Imports

- Use ES modules (`import/export`) exclusively
- Order: Vue/Nuxt imports → Third-party → Local/Relative
- Auto-imports are enabled via Nuxt (no need to import `ref`, `computed`, etc.)
- Explicit imports preferred for clarity on composables

```typescript
import type { Movie } from '~/types'
// Good
import { toast } from 'vue-sonner'
```

### Formatting

- **Indent**: 2 spaces
- **Quotes**: Single quotes for JS/TS strings
- **Semicolons**: No semicolons (Antfu ESLint config)
- **Trailing commas**: Always (multiline)
- **Line width**: ~100 characters (be reasonable)

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `MovieCard.vue` |
| Composables | camelCase, start with 'use' | `useMovies.ts` |
| Types/Interfaces | PascalCase | `interface Movie { }` |
| Variables | camelCase | `const movieList = ref([])` |
| Constants | UPPER_SNAKE_CASE | `const MAX_MOVIES = 100` |
| Props | camelCase in setup | `const props = defineProps<{ title: string }>()` |
| Events | camelCase, 'on' prefix | `const onSubmit = () => {}` |

### Types

- Use TypeScript strictly (strict mode enabled implicitly via Nuxt)
- Define interfaces for all data structures
- Use `type` for unions/intersections, `interface` for object shapes
- Prefer explicit return types on exported functions
- Use Vue's `PropType` for complex prop types

```typescript
// Good
interface Movie {
  id: number
  title: string
  year: number
  genre: string[]
  rating: number
  director: string
  description: string
  poster?: string
}

type TabType = 'number' | 'food' | 'movie'
```

### Vue/Nuxt Conventions

- Use `<script setup lang="ts">` exclusively
- Use Composition API (no Options API)
- Use `ref`/`reactive` for state, `computed` for derived
- Use `defineProps`/`defineEmits` for component interfaces
- Use `$fetch` for API calls (built into Nuxt)
- Use `useFetch`/`useAsyncData` for SSR data fetching
- Place components in `components/` (auto-imported)
- Place pages in `pages/` (file-based routing)
- Place composables in `composables/` (auto-imported)

### Styling (UnoCSS)

- Use UnoCSS utility classes exclusively (no custom CSS except for animations)
- Use attributify mode: `<div flex="~ items-center gap-4">`
- Use shortcuts defined in `uno.config.ts` (e.g., `btn-primary`, `card`, `input`)
- Custom animations defined in `<style>` blocks when needed
- Use `dark:` variant for dark mode styles
- Color palette: slate (grays), blue/indigo (primary), orange/red (accent), purple (secondary)

```html
<!-- Good -->
<div flex="~ items-center gap-2" text-lg font-bold text-slate-800 dark:text-white>
  <div i-mdi-history text-blue-500 />
  <span>History</span>
</div>
```

### Error Handling

- Use `vue-sonner` for toast notifications: `toast.success()`, `toast.error()`, `toast.info()`
- Handle errors at component level with try/catch
- Validate user input before processing
- Use early returns for guard clauses
- Show user-friendly error messages in Chinese (app is Chinese-language)

```typescript
// Good
function generateNumbers() {
  const { min, max, count, unique } = numberConfig
  if (min > max) {
    toast.error('最小值不能大于最大值！')
    return
  }
  if (unique && count > (max - min + 1)) {
    toast.error('唯一模式下，生成数量不能超过范围大小！')
  }
  // ... rest of logic
}
```

## Project Structure

```
/Users/linzhangsheng/Desktop/project/random-number/
├── app.vue              # Root app component
├── pages/
│   └── index.vue       # Main page (all features here)
├── nuxt.config.ts      # Nuxt configuration
├── uno.config.ts       # UnoCSS configuration (shortcuts, theme)
├── eslint.config.js    # ESLint configuration (@antfu/eslint-config)
├── tsconfig.json       # TypeScript config (extends .nuxt/tsconfig.json)
├── package.json        # Dependencies & scripts
└── README.md
```

## Important Notes

1. **Linting is strict**: Run `pnpm lint` before committing. Auto-fix with `pnpm lint:fix`.

2. **Chinese language**: All user-facing text is in Chinese. Code/comments can be in English.

3. **No tests**: The project has no test suite configured. Manual testing in browser required.

4. **pnpm only**: Uses pnpm@9.15.4. Don't use npm/yarn.

5. **UnoCSS attributify**: Use `flex="~ items-center gap-4"` syntax, not `class="flex items-center gap-4"`.

6. **Vue auto-imports**: `ref`, `computed`, `watch`, etc. are auto-imported by Nuxt.

7. **Icon usage**: Use `i-mdi-{icon-name}` classes for Material Design Icons.

8. **Dark mode**: Built-in via `dark:` prefix. Uses class strategy (`dark: 'class'`).
