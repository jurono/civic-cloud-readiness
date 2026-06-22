<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import RegionFilter from '@/components/readiness/RegionFilter.vue'
import ServiceTable from '@/components/readiness/ServiceTable.vue'
import MetricTile from '@/components/ui/MetricTile.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useReadinessStore } from '@/stores/readiness'

const store = useReadinessStore()
const {
  activeIncidents,
  error,
  filteredServices,
  isLoading,
  regions,
  selectedRegion,
  summary,
} = storeToRefs(store)

onMounted(() => {
  if (store.services.length === 0) void store.loadDashboard()
})
</script>

<template>
  <section class="overview" :aria-busy="isLoading">
    <div class="intro">
      <p>
        A senior-facing Vue implementation for cloud operations teams: typed service health,
        readiness scoring, accessible controls, and lazy-loaded feature routes.
      </p>
      <StatusBadge :status="summary.status" />
    </div>

    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <p v-else-if="isLoading">Loading readiness data...</p>

    <template v-else>
      <RegionFilter
        :regions="regions"
        :selected-region="selectedRegion"
        @change="store.setRegion"
      />

      <div class="metrics" aria-label="Readiness metrics">
        <MetricTile
          label="Readiness score"
          :value="summary.score"
          detail="Weighted operational score"
        />
        <MetricTile
          label="Availability"
          :value="`${summary.avgAvailability}%`"
          detail="Average over selected services"
        />
        <MetricTile
          label="p95 latency"
          :value="`${summary.avgLatencyMs} ms`"
          detail="Average selected service latency"
        />
        <MetricTile
          label="Open incidents"
          :value="activeIncidents.length"
          detail="Sorted by operational priority"
        />
      </div>

      <ServiceTable :services="filteredServices" />
    </template>
  </section>
</template>

<style scoped>
.overview {
  display: grid;
  gap: 1.25rem;
}

.intro {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  max-width: 920px;
}

.intro p {
  margin: 0;
  color: var(--muted);
  font-size: 1.1rem;
  line-height: 1.6;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.error {
  border-left: 4px solid var(--danger);
  background: rgb(180 35 24 / 9%);
  padding: 1rem;
}

@media (max-width: 900px) {
  .metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .intro {
    flex-direction: column;
  }

  .metrics {
    grid-template-columns: 1fr;
  }
}
</style>
