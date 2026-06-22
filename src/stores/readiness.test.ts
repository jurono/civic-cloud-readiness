import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useReadinessStore } from './readiness'
import { cloudServices } from '../../server/data'
import type { Incident } from '@/domain/incidents'

const apiIncidents: Incident[] = [
  {
    id: 'INC-2481',
    title: 'Object storage latency above education portal threshold',
    serviceId: 'learning',
    region: 'de-ber-1',
    severity: 'sev2',
    openedAt: '2026-06-21T08:12:00.000Z',
    status: 'mitigating',
    customerImpact: 'File previews intermittently exceed agreed response targets.',
    nextAction: 'Shift read traffic to warm replica and validate cache hit rate.',
    runbookUrl: 'https://example.com/runbooks/storage-latency',
  },
  {
    id: 'INC-2474',
    title: 'Archive maintenance validation',
    serviceId: 'research-data',
    region: 'eu-ams-1',
    severity: 'sev3',
    openedAt: '2026-06-20T22:00:00.000Z',
    status: 'monitoring',
    customerImpact: 'Scheduled archive imports are paused for selected institutions.',
    nextAction: 'Confirm checksum report before re-enabling imports.',
    runbookUrl: 'https://example.com/runbooks/archive-maintenance',
  },
]

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

describe('readiness store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input)

        if (url.endsWith('/services')) return jsonResponse(cloudServices)
        if (url.endsWith('/incidents') && init?.method === 'POST') {
          return jsonResponse(
            {
              id: 'INC-NEW',
              openedAt: '2026-06-22T08:00:00.000Z',
              status: 'triage',
              ...JSON.parse(String(init.body)),
            },
            { status: 201 },
          )
        }
        if (url.endsWith('/incidents')) return jsonResponse(apiIncidents)

        return jsonResponse({ message: 'Not found' }, { status: 404 })
      }),
    )
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

  it('posts a new incident and adds it to the queue', async () => {
    const store = useReadinessStore()
    await store.loadDashboard()

    const incident = await store.reportIncident({
      title: 'Benefits workflow unavailable',
      serviceId: 'benefits',
      region: 'de-fra-1',
      severity: 'sev1',
      customerImpact: 'Applicants cannot submit benefits forms.',
      nextAction: 'Fail over form renderer to the standby cluster.',
      runbookUrl: 'https://example.com/runbooks/forms',
    })

    expect(incident?.id).toBe('INC-NEW')
    expect(store.activeIncidents[0]?.id).toBe('INC-NEW')
  })
})
