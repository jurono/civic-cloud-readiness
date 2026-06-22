import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import {
  sortIncidentsByOperationalPriority,
  type Incident,
  type NewIncidentReport,
} from '@/domain/incidents'
import { summarizeReadiness, type CloudService, type Region } from '@/domain/readiness'
import { cloudReadinessClient } from '@/services/cloudReadinessClient'

export const useReadinessStore = defineStore('readiness', () => {
  const services = ref<CloudService[]>([])
  const incidents = ref<Incident[]>([])
  const selectedRegion = ref<Region | 'all'>('all')
  const isLoading = ref(false)
  const isReporting = ref(false)
  const error = ref<string | null>(null)
  const reportError = ref<string | null>(null)

  const filteredServices = computed(() => {
    if (selectedRegion.value === 'all') return services.value
    return services.value.filter((service) => service.region === selectedRegion.value)
  })

  const summary = computed(() => summarizeReadiness(filteredServices.value))

  const activeIncidents = computed(() =>
    sortIncidentsByOperationalPriority(
      incidents.value.filter((incident) => incident.status !== 'resolved'),
    ),
  )

  const regions = computed(() => {
    const uniqueRegions = new Set(services.value.map((service) => service.region))
    return Array.from(uniqueRegions).sort()
  })

  async function loadDashboard(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const [serviceResponse, incidentResponse] = await Promise.all([
        cloudReadinessClient.listServices(),
        cloudReadinessClient.listIncidents(),
      ])
      services.value = serviceResponse
      incidents.value = incidentResponse
    } catch (cause) {
      error.value =
        cause instanceof Error ? cause.message : 'Unable to load cloud readiness data.'
    } finally {
      isLoading.value = false
    }
  }

  async function reportIncident(report: NewIncidentReport): Promise<Incident | null> {
    isReporting.value = true
    reportError.value = null

    try {
      const incident = await cloudReadinessClient.reportIncident(report)
      incidents.value = [incident, ...incidents.value]
      return incident
    } catch (cause) {
      reportError.value =
        cause instanceof Error ? cause.message : 'Unable to report incident.'
      return null
    } finally {
      isReporting.value = false
    }
  }

  function setRegion(region: Region | 'all'): void {
    selectedRegion.value = region
  }

  return {
    services,
    incidents,
    selectedRegion,
    isLoading,
    isReporting,
    error,
    reportError,
    filteredServices,
    summary,
    activeIncidents,
    regions,
    loadDashboard,
    reportIncident,
    setRegion,
  }
})
