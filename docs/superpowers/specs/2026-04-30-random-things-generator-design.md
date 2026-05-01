# Random Things Generator Redesign

## Goal

Refactor the tiny Nuxt app into a focused random things generator while keeping
random number generation as the first and most prominent mode.

The app should feel like a compact utility, not a landing page. The first screen
should contain only the controls needed to generate a result.

## Product Direction

- Default mode: Random Number.
- Secondary modes: Custom list, food, and movie.
- Primary user: one person making personal decisions or draws.
- Priority: fair/random draws with clear settings.
- Out of scope: recent history, feature sections, scenario sections, and
  marketing-style explanatory content.

## User Interface

The app is a single-screen generator workspace:

1. Header with app name and optional theme toggle.
2. Mode tabs: Number, Custom, Food, Movie.
3. Settings panel that changes by mode.
4. Primary generate button.
5. Result panel.

Random Number must appear first and be selected on initial load. The visual
hierarchy should make the result panel and generate action obvious without adding
extra content below the tool.

## Generator Modes

### Number

Settings:

- Minimum value.
- Maximum value.
- Count.
- Unique numbers toggle.
- Integer mode.
- Sort results toggle.

Validation:

- Minimum must be less than or equal to maximum.
- Count must be at least 1.
- Unique mode cannot request more numbers than the range contains.

### Custom List

Settings:

- Textarea for one item per line or comma-separated items.
- Count.
- Unique picks toggle.

Validation:

- Empty items are ignored.
- At least one valid item is required.
- Unique mode cannot request more results than available items.

### Food

Settings:

- Use a built-in food list.
- Optional custom additions through the same list parser used by Custom List.
- Count.

### Movie

Settings:

- Use a built-in movie list.
- Optional custom additions through the same list parser used by Custom List.
- Count.

## Architecture

Keep the implementation small, but split responsibilities enough to avoid one
large Vue file owning all behavior:

- `app/app.vue`: page composition and mode state.
- `app/composables/useRandomGenerator.ts`: generation logic and validation.
- `app/data/generatorPresets.ts`: built-in food and movie lists.
- `app/types/generator.ts`: mode, result, and configuration types.

The random generation logic should be framework-light and typed. UI components
can stay inside `app/app.vue` unless the file becomes difficult to scan.

## Styling

Use UnoCSS attributify syntax and existing shortcuts where they still fit. The
approved direction is minimal and tool-focused:

- Warm neutral page background can remain.
- No homepage highlight cards.
- No scenario section.
- No recent history grid.
- Use clear tabs, compact inputs, and a large result panel.
- Keep all user-facing copy in Chinese.

## Error Handling

Show validation errors near the settings panel. Messages should be short,
Chinese, and actionable.

Examples:

- `最小值不能大于最大值。`
- `唯一模式下，数量不能超过可选范围。`
- `请至少输入一个可选项。`

## Verification

Before considering the implementation complete:

- Run `pnpm lint`.
- Manually verify the app in the browser.
- Check number mode initial state.
- Check each mode can generate a result.
- Check invalid inputs show Chinese validation errors.
- Check mobile layout keeps tabs, settings, button, and result readable.
