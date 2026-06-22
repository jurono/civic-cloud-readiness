# Architecture Notes

This project is intentionally designed as a compact senior frontend sample.

## Domain first

Operational scoring and incident sorting live in pure TypeScript modules under `src/domain`. Those rules can be tested without mounting Vue and can later be shared with worker jobs, API validation, or reporting tools.

## API boundary

`src/services/cloudReadinessClient.ts` defines the frontend-facing contract. The current implementation uses fixtures, but components and stores depend on the interface shape instead of fixture details. In a production app this boundary is where an OpenAPI-generated REST client would be introduced.

## State management

Pinia owns async loading, selected filters, and computed projections. Route components use the store through `storeToRefs`, which keeps reactivity explicit and avoids prop drilling across unrelated UI sections.

## Rendering strategy

The app uses SPA rendering because the data is operational and user-specific. The route setup still demonstrates performance basics through dynamic imports. For public documentation or marketing pages, Nuxt SSR/SSG would be the natural extension.

## Accessibility choices

- semantic table markup for service health
- `fieldset` and `legend` for filter grouping
- `aria-pressed` on segmented filter controls
- skip navigation and visible focus styles
- no color-only status communication

## Review checklist

- `npm run test` covers domain logic and accessible interaction behavior
- `npm run build` validates TypeScript and production bundling
- `npm run lint` enforces Vue and TypeScript conventions
