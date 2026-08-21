# AGENTS.md - Agentic Coding Guidelines

## Project Overview

This is a **Nuxt 4** + **Vue 3** application called "Random Generator" (随机生成器) - a feature-rich random generator supporting random numbers, food selection, and movie recommendations. Uses TypeScript, UnoCSS for styling, and oxlint + oxfmt for linting and formatting (migrated from @antfu/eslint-config).

## Attention
Use skills!!

## Tech Stack

- **Framework**: Nuxt 4.5.2 with Vue 3.5.41 (source in `app/`)
- **Language**: TypeScript 5.7.3
- **Styling**: UnoCSS (66.8) + @unocss/reset/tailwind.css
- **Design System**: Minimal Swiss — CSS variables in `app/assets/css/main.css`, mapped to UnoCSS theme colors in `uno.config.ts`
- **Icons**: Iconify (via UnoCSS preset-icons)
- **Linting**: oxlint (1.79) with migrated @antfu/eslint-config rules
- **Formatting**: oxfmt (0.64) with import sorting

## Build/Lint/Test Commands

```bash
# Development
pnpm dev              # Start dev server

# Build
pnpm build            # Build for production
pnpm generate         # Generate static site
pnpm preview          # Preview production build

# Linting & formatting (CRITICAL - must pass)
pnpm lint             # Check linting + formatting
pnpm lint:fix         # Fix linting issues + format code
pnpm format           # Format code (oxfmt)
pnpm format:check     # Check formatting (oxfmt --check)

# Type checking (via nuxt prepare)
pnpm postinstall      # Prepare nuxt (runs type generation)
```

**Note**: There are currently no test files or test commands configured.

## Code Style Guidelines

### Imports

- Use ES modules (`import/export`) exclusively
- Order: Vue/Nuxt imports → Third-party → Local/Relative
- Auto-imports are enabled via Nuxt (no need to import `ref`, `computed`, etc., or composables in `app/composables/`)
- Explicit imports for files in `app/data/` and `app/types/` (not auto-imported)

```typescript
import { foodPresets } from '~/data/generatorPresets'
import type { GeneratorMode } from '~/types/generator'
```

### Formatting

- **Indent**: 2 spaces
- **Quotes**: Single quotes for JS/TS strings
- **Semicolons**: No semicolons (oxfmt/oxlint style rules)
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

### Styling (UnoCSS + Minimal Swiss design system)

- **No border-radius, no shadows, no gradients** — Minimal Swiss style. Sharp corners, 1px `border-line` borders, high-contrast black/white + single indigo accent.
- Use UnoCSS utility classes; design tokens live as CSS variables in `app/assets/css/main.css` (`--color-*`, `--font-sans`) and are mapped to UnoCSS theme colors (`bg-page`, `text-ink`, `border-line`, `text-accent`, etc.)
- Use shortcuts defined in `uno.config.ts` (`panel`, `input`, `btn-primary`, `btn-ghost`, `field-label`, `container`, `tab-active`/`tab-inactive`)
- Custom animations defined in `<style>` blocks when needed (e.g., result transition)
- Theme colors via CSS variables (`bg-page` light/dark), not `dark:` variants for every element
- Color palette: `page`/`panel` backgrounds, `ink`/`muted`/`faint` text, `line` borders, `accent` (indigo), `danger` (red), `inverted` for the dark result panel

```html
<!-- Good -->
<section class="panel flex flex-col gap-6 p-5 sm:p-8">
  <button type="button" class="btn-primary cursor-pointer" @click="generate">
    <span class="i-mdi-dice-multiple-outline" aria-hidden="true" />
    生成
  </button>
</section>
```

### Error Handling

- Validation errors are thrown from `useRandomGenerator` and rendered inline as red text (`text-danger`) in the config panel
- Handle errors at component level with try/catch
- Validate user input before processing
- Use early returns for guard clauses
- Show user-friendly error messages in Chinese (app is Chinese-language)

```typescript
// Good
function generate() {
  try {
    errorMessage.value = ''
    result.value = generateNumbers(numberConfig)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '生成失败，请检查输入。'
  }
}
```

## Project Structure

```
/Users/linzhangsheng/Desktop/project/random-number/
├── app/
│   ├── app.vue                # Root app shell (<NuxtPage/> + useHead)
│   ├── assets/css/main.css   # Design tokens: CSS variables (light/dark)
│   ├── pages/
│   │   └── index.vue         # Main page (mode state, generation orchestration)
│   ├── components/           # Auto-imported UI components
│   │   ├── AppHeader.vue     # Brand + theme toggle
│   │   ├── ModeTabs.vue      # Mode selector tabs
│   │   ├── NumberConfigPanel.vue  # Number settings + toggles
│   │   ├── ListConfigPanel.vue    # Custom list settings + toggles
│   │   ├── ResultPanel.vue   # Inverted-color result panel + copy
│   │   └── ToggleSwitch.vue  # Reusable switch (v-model)
│   ├── composables/
│   │   ├── useRandomGenerator.ts  # Generation/validation logic
│   │   └── useTheme.ts       # Theme state, persistence, system listener
│   ├── data/generatorPresets.ts   # Food/movie presets
│   └── types/generator.ts    # Shared types
├── nuxt.config.ts            # Nuxt config (CSS, fonts, anti-FOUC script)
├── uno.config.ts             # UnoCSS config (theme colors, shortcuts)
├── .oxlintrc.json            # Oxlint configuration (migrated from @antfu/eslint-config)
├── .oxfmtrc.json             # Oxfmt formatter configuration
├── tsconfig.json             # TypeScript config (extends .nuxt/tsconfig.json)
├── package.json              # Dependencies & scripts
└── README.md
```

## Important Notes

1. **Linting is strict**: Run `pnpm lint` before committing. Auto-fix with `pnpm lint:fix`.

2. **Chinese language**: All user-facing text is in Chinese. Code/comments can be in English.

3. **No tests**: The project has no test suite configured. Manual testing in browser required.

4. **pnpm only**: Uses pnpm@11.22.0. Don't use npm/yarn.

5. **UnoCSS shortcuts**: Prefer shortcuts (`panel`, `btn-primary`, `input`) over raw utility strings for repeated elements.

6. **Vue auto-imports**: `ref`, `computed`, `watch`, etc. are auto-imported by Nuxt, as are components in `app/components/` and composables in `app/composables/`.

7. **Icon usage**: Use `i-mdi-{icon-name}` classes for Material Design Icons.

8. **Dark mode**: Class strategy (`html.dark`), driven by CSS variables in `app/assets/css/main.css`. An inline anti-FOUC script in `nuxt.config.ts` applies the stored/system theme before first paint; `useTheme` manages state, persistence (key `random-generator-theme`), and system-preference changes.
