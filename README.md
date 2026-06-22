# Civic Cloud Readiness

A Vue 3 and TypeScript reference application for cloud platform operations. The app models a realistic service-readiness console for teams running high-availability public-sector, education, or research platforms.

It is intentionally scoped as a portfolio-quality code sample: small enough to review, but complete enough to show architecture, typed state, API boundaries, accessibility, performance-minded routing, and tests.

## Why this project exists

LUMASERV's job description asks for Vue 3, TypeScript, Composition API, scalable frontend architecture, accessibility, API integration, performance optimization, Design System work, testing, and pragmatic technical ownership.

This repository demonstrates those topics through a real-world scenario:

- monitor cloud service health across regions and tenants through a local API
- inspect and report incidents through validated HTTP endpoints
- evaluate operational risk with typed domain logic
- reuse accessible UI primitives
- keep API and frontend state boundaries explicit
- lazy-load feature views to reduce initial bundle cost

## Tech stack

- Vue 3 with Composition API
- TypeScript with strict compiler settings
- Pinia for store-level state
- Vue Router with lazy-loaded routes
- Express API server with request validation
- Vite build tooling
- Vitest and Testing Library for focused behavior tests
- CSS modules through scoped component styles and design tokens

## Local development

```sh
npm install
npm run dev
```

The development command starts both services:

- web app: `http://localhost:5173`
- API: `http://localhost:8787`

## Quality checks

```sh
npm run lint
npm run test
npm run build
```

## Architecture highlights

- `src/domain` contains pure TypeScript models and scoring rules.
- `server` contains the local Express API for services and incident reports.
- `src/services` contains the typed HTTP client used by Pinia stores.
- `src/stores` owns state orchestration and keeps views thin.
- `src/components` contains reusable, accessible UI components.
- `src/views` contains route-level feature screens, including the incident report flow.
- `openapi/readiness.yaml` documents the REST contract implemented by the local API.

## Portfolio note

This is a demonstration project, not a production monitoring system. The implementation uses local fixture data so reviewers can run it without credentials or infrastructure access.
