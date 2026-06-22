<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import IncidentCard from '@/components/incidents/IncidentCard.vue'
import { useReadinessStore } from '@/stores/readiness'

const store = useReadinessStore()
const { activeIncidents, isLoading } = storeToRefs(store)

onMounted(() => {
  if (store.services.length === 0) void store.loadDashboard()
})
</script>

<template>
  <section class="incidents">
    <p>
      Incidents are presented as operator-ready work items: severity, customer impact,
      region, next action, and runbook context stay visible without drilling through a
      dashboard.
    </p>

    <p v-if="isLoading">Loading incident queue...</p>
    <div v-else-if="activeIncidents.length > 0" class="incident-grid">
      <IncidentCard
        v-for="incident in activeIncidents"
        :key="incident.id"
        :incident="incident"
      />
    </div>
    <p v-else>No active incidents.</p>
  </section>
</template>

<style scoped>
.incidents {
  display: grid;
  gap: 1rem;
}

.incidents > p {
  max-width: 760px;
  margin: 0;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.6;
}

.incident-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 820px) {
  .incident-grid {
    grid-template-columns: 1fr;
  }
}
</style>
