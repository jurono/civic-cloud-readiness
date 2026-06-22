<template>
  <section class="notes">
    <article>
      <h2>Vue architecture</h2>
      <p>
        Route views are lazy-loaded, stores coordinate API state, and pure domain modules
        keep scoring rules testable outside Vue. This keeps Composition API code focused on
        orchestration instead of business logic.
      </p>
    </article>

    <article>
      <h2>Accessibility</h2>
      <p>
        The shell includes skip navigation, semantic tables, real buttons for filters,
        visible focus states, status text alongside visual indicators, and stable contrast
        tokens.
      </p>
    </article>

    <article>
      <h2>API integration</h2>
      <p>
        The fixture client intentionally matches a REST-style boundary. It can be replaced
        by an OpenAPI generated client without changing components or domain rules.
      </p>
    </article>

    <article>
      <h2>Performance</h2>
      <p>
        The initial bundle stays small through route-level code splitting. Data derivation
        is computed from normalized store state and avoids extra component-local copies.
      </p>
    </article>
  </section>
</template>

<style scoped>
.notes {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

article {
  min-height: 12rem;
  border: 1px solid var(--line);
  border-radius: 0.5rem;
  background: var(--surface);
  box-shadow: var(--shadow);
  padding: 1.2rem;
}

h2 {
  margin: 0 0 0.75rem;
}

p {
  margin: 0;
  color: var(--muted);
  line-height: 1.65;
}

@media (max-width: 760px) {
  .notes {
    grid-template-columns: 1fr;
  }
}
</style>
