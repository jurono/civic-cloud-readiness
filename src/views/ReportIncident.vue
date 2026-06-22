<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import type { NewIncidentReport } from '@/domain/incidents'
import { useReadinessStore } from '@/stores/readiness'

const store = useReadinessStore()
const router = useRouter()
const { reportError, services, isLoading, isReporting } = storeToRefs(store)
const successId = ref<string | null>(null)

const form = reactive<NewIncidentReport>({
  title: '',
  serviceId: '',
  region: 'de-fra-1',
  severity: 'sev2',
  customerImpact: '',
  nextAction: '',
  runbookUrl: 'https://example.com/runbooks/',
})

const selectedService = computed(() =>
  services.value.find((service) => service.id === form.serviceId),
)

onMounted(async () => {
  if (store.services.length === 0) await store.loadDashboard()
  if (!form.serviceId && store.services[0]) {
    form.serviceId = store.services[0].id
    form.region = store.services[0].region
  }
})

function syncServiceRegion(): void {
  if (selectedService.value) form.region = selectedService.value.region
}

async function submitReport(): Promise<void> {
  successId.value = null
  const incident = await store.reportIncident({ ...form })
  if (!incident) return

  successId.value = incident.id
  await router.push('/incidents')
}
</script>

<template>
  <section class="report">
    <p>
      Submit a structured incident report directly into the operations queue. The API
      validates service ownership, severity, region, customer impact, next action, and
      runbook context before accepting the incident.
    </p>

    <p v-if="isLoading">Loading services...</p>

    <form v-else class="form" @submit.prevent="submitReport">
      <p v-if="reportError" role="alert" class="error">{{ reportError }}</p>
      <p v-if="successId" role="status" class="success">Created {{ successId }}.</p>

      <label>
        Incident title
        <input v-model.trim="form.title" name="title" minlength="8" required />
      </label>

      <div class="form__grid">
        <label>
          Affected service
          <select
            v-model="form.serviceId"
            name="serviceId"
            required
            @change="syncServiceRegion"
          >
            <option v-for="service in services" :key="service.id" :value="service.id">
              {{ service.name }}
            </option>
          </select>
        </label>

        <label>
          Region
          <select v-model="form.region" name="region" required>
            <option value="de-fra-1">de-fra-1</option>
            <option value="de-ber-1">de-ber-1</option>
            <option value="eu-ams-1">eu-ams-1</option>
          </select>
        </label>

        <label>
          Severity
          <select v-model="form.severity" name="severity" required>
            <option value="sev1">SEV1 - critical outage</option>
            <option value="sev2">SEV2 - degraded service</option>
            <option value="sev3">SEV3 - operational follow-up</option>
          </select>
        </label>
      </div>

      <label>
        Customer impact
        <textarea
          v-model.trim="form.customerImpact"
          name="customerImpact"
          rows="4"
          required
        />
      </label>

      <label>
        Next action
        <textarea v-model.trim="form.nextAction" name="nextAction" rows="3" required />
      </label>

      <label>
        Runbook URL
        <input v-model.trim="form.runbookUrl" name="runbookUrl" type="url" required />
      </label>

      <button type="submit" :disabled="isReporting">
        {{ isReporting ? 'Submitting...' : 'Submit incident' }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.report {
  display: grid;
  gap: 1rem;
}

.report > p {
  max-width: 780px;
  margin: 0;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.6;
}

.form {
  display: grid;
  max-width: 860px;
  gap: 1rem;
  border: 1px solid var(--line);
  border-radius: 0.5rem;
  background: var(--surface);
  box-shadow: var(--shadow);
  padding: 1rem;
}

.form__grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
}

label {
  display: grid;
  gap: 0.35rem;
  color: var(--muted);
  font-weight: 800;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 0.5rem;
  background: white;
  color: var(--text);
  padding: 0.75rem;
}

textarea {
  resize: vertical;
}

button {
  width: fit-content;
  border: 0;
  border-radius: 0.5rem;
  background: var(--accent-strong);
  color: white;
  cursor: pointer;
  font-weight: 800;
  padding: 0.85rem 1rem;
}

button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.error,
.success {
  margin: 0;
  padding: 0.85rem 1rem;
}

.error {
  border-left: 4px solid var(--danger);
  background: rgb(180 35 24 / 9%);
}

.success {
  border-left: 4px solid var(--ok);
  background: rgb(19 121 91 / 12%);
}

@media (max-width: 820px) {
  .form__grid {
    grid-template-columns: 1fr;
  }
}
</style>
