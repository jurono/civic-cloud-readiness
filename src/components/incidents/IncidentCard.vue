<script setup lang="ts">
import type { Incident } from '@/domain/incidents'

defineProps<{
  incident: Incident
}>()
</script>

<template>
  <article class="incident">
    <div class="incident__topline">
      <span>{{ incident.id }}</span>
      <strong>{{ incident.severity }}</strong>
    </div>

    <h2>{{ incident.title }}</h2>
    <dl>
      <div>
        <dt>Region</dt>
        <dd>{{ incident.region }}</dd>
      </div>
      <div>
        <dt>Status</dt>
        <dd>{{ incident.status }}</dd>
      </div>
      <div>
        <dt>Customer impact</dt>
        <dd>{{ incident.customerImpact }}</dd>
      </div>
      <div>
        <dt>Next action</dt>
        <dd>{{ incident.nextAction }}</dd>
      </div>
    </dl>

    <a :href="incident.runbookUrl">Open runbook</a>
  </article>
</template>

<style scoped>
.incident {
  border: 1px solid var(--line);
  border-radius: 0.5rem;
  background: var(--surface);
  box-shadow: var(--shadow);
  padding: 1rem;
}

.incident__topline {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
}

h2 {
  margin: 0.7rem 0 1rem;
}

dl {
  display: grid;
  gap: 0.8rem;
  margin: 0 0 1rem;
}

dt {
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 800;
}

dd {
  margin: 0.2rem 0 0;
}

a {
  color: var(--accent-strong);
  font-weight: 800;
}
</style>
