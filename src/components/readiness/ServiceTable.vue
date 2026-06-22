<script setup lang="ts">
import { calculateServiceRisk, type CloudService } from '@/domain/readiness'
import StatusBadge from '@/components/ui/StatusBadge.vue'

defineProps<{
  services: CloudService[]
}>()
</script>

<template>
  <section class="panel" aria-labelledby="services-heading">
    <div class="panel__header">
      <h2 id="services-heading">Service readiness</h2>
      <p>{{ services.length }} services in scope</p>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Service</th>
            <th scope="col">Region</th>
            <th scope="col">Status</th>
            <th scope="col">Availability</th>
            <th scope="col">p95 latency</th>
            <th scope="col">Risk</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in services" :key="service.id">
            <th scope="row">
              <span>{{ service.name }}</span>
              <small>{{ service.owner }}</small>
            </th>
            <td>{{ service.region }}</td>
            <td><StatusBadge :status="service.status" /></td>
            <td>
              {{ service.availabilityActual }}%
              <small>target {{ service.availabilityTarget }}%</small>
            </td>
            <td>{{ service.p95LatencyMs }} ms</td>
            <td>
              <meter
                min="0"
                max="100"
                low="25"
                high="70"
                optimum="0"
                :value="calculateServiceRisk(service)"
              >
                {{ calculateServiceRisk(service) }}
              </meter>
              <span>{{ calculateServiceRisk(service) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.panel {
  border: 1px solid var(--line);
  border-radius: 0.5rem;
  background: var(--surface);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.panel__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--line);
  padding: 1rem;
}

h2,
p {
  margin: 0;
}

p,
small {
  color: var(--muted);
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
}

th,
td {
  border-bottom: 1px solid var(--line);
  padding: 1rem;
  text-align: left;
  vertical-align: middle;
}

tbody tr:last-child th,
tbody tr:last-child td {
  border-bottom: 0;
}

tbody th span,
tbody th small,
td small {
  display: block;
}

meter {
  width: 5rem;
  margin-right: 0.5rem;
}
</style>
