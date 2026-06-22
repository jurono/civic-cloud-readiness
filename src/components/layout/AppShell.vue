<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

const navigation = [
  { label: 'Operations', to: '/' },
  { label: 'Incidents', to: '/incidents' },
  { label: 'Report incident', to: '/report-incident' },
] as const

const currentTitle = computed(() => {
  if (route.name === 'incidents') return 'Incident response workspace'
  if (route.name === 'report-incident') return 'Report an incident'
  return 'Cloud service readiness'
})
</script>

<template>
  <div class="shell">
    <header class="shell__header">
      <RouterLink class="brand" to="/" aria-label="Civic Cloud Readiness home">
        <span class="brand__mark" aria-hidden="true">CCR</span>
        <span>
          <strong>Civic Cloud Readiness</strong>
          <small>Vue 3 reliability console</small>
        </span>
      </RouterLink>

      <nav class="nav" aria-label="Primary">
        <RouterLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="nav__link"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </header>

    <main id="main" class="shell__main" tabindex="-1">
      <p class="eyebrow">Reference implementation</p>
      <h1>{{ currentTitle }}</h1>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.shell {
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
}

.shell__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.25rem 0;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.brand__mark {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border-radius: 0.5rem;
  background: var(--accent-strong);
  color: white;
  font-size: 0.78rem;
  font-weight: 800;
}

.brand strong,
.brand small {
  display: block;
}

.brand small {
  color: var(--muted);
  margin-top: 0.12rem;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.nav__link {
  border-radius: 0.5rem;
  color: var(--muted);
  padding: 0.6rem 0.85rem;
  text-decoration: none;
}

.nav__link.router-link-active {
  background: var(--surface);
  box-shadow: var(--shadow);
  color: var(--text);
}

.shell__main {
  padding: 2rem 0 4rem;
}

.eyebrow {
  margin: 0 0 0.5rem;
  color: var(--accent-strong);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  max-width: 760px;
  margin: 0 0 1.5rem;
  font-size: clamp(2.2rem, 7vw, 5rem);
  line-height: 0.95;
}

@media (max-width: 760px) {
  .shell__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .nav {
    width: 100%;
  }

  .nav__link {
    flex: 1 1 9rem;
    text-align: center;
  }
}
</style>
