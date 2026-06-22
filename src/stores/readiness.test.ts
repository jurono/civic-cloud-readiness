import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useReadinessStore } from './readiness'

describe('readiness store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads services and derives regional readiness projections', async () => {
    const store = useReadinessStore()

    await store.loadDashboard()

    expect(store.services).toHaveLength(4)
    expect(store.activeIncidents.map((incident) => incident.id)).toEqual([
      'INC-2481',
      'INC-2474',
    ])
    expect(store.regions).toEqual(['de-ber-1', 'de-fra-1', 'eu-ams-1'])

    store.setRegion('de-ber-1')

    expect(store.filteredServices).toHaveLength(1)
    expect(store.summary.status).toBe('at-risk')
  })
})
