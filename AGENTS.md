# Repository Guidelines

## Project Structure & Module Organization

This is a Vue 3 and TypeScript cloud-readiness console built with Vite. Client code lives in `src/`: reusable UI in `src/components`, route screens in `src/views`, Pinia state in `src/stores`, pure domain logic in `src/domain`, API clients in `src/services`, and shared composables in `src/composables`. The app entry is `src/main.ts`, with routing in `src/router`. Local API fixtures and validation are in `server/`. The OpenAPI contract is documented in `openapi/readiness.yaml`. Static entry markup is in `index.html`; generated output goes to `dist/`.

## Build, Test, and Development Commands

- `npm install`: install dependencies. Node `>=20.19` is required.
- `npm run dev`: start the Express API watcher and Vite dev server together.
- `npm run api`: run only the local API from `server/index.ts`.
- `npm run build`: run `vue-tsc` type checks and build the Vite bundle.
- `npm run preview`: serve the built app locally for smoke testing.
- `npm run lint`: run ESLint across the repo.
- `npm run test`: run Vitest once.
- `npm run test:watch`: run Vitest in watch mode.
- `npm run format`: format files with Prettier.

## Coding Style & Naming Conventions

Use TypeScript, Vue single-file components, and Composition API patterns. Keep route-level behavior in `src/views` and move reusable logic into composables, stores, or pure domain modules. Component files use PascalCase, such as `StatusBadge.vue`; composables use `useName.ts`; tests use `*.test.ts`. Prefer the `@/` alias for imports from `src`. Formatting is handled by Prettier, and linting uses ESLint with Vue and TypeScript rules.

## Testing Guidelines

Vitest runs in `jsdom` with setup from `src/test/setup.ts`. Add focused unit tests near the code they cover, following the existing pattern in `src/domain/*.test.ts`, `src/stores/*.test.ts`, and component tests such as `RegionFilter.test.ts`. Prioritize domain scoring rules, store projections, user-visible component behavior, and API-client boundaries. Run `npm run test` before submitting changes; use `npm run build` when type contracts or route behavior changed.

## Commit & Pull Request Guidelines

Recent commits use Conventional Commit style, for example `feat: build Vue cloud readiness console`, `docs: add readiness API contract`, and `test: cover readiness store projections`. Keep commits scoped and imperative. Pull requests should explain the user-facing change, list verification commands run, link related issues when available, and include screenshots or short recordings for UI changes.
