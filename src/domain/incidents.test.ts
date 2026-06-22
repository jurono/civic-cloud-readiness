import { describe, expect, it } from 'vitest'

import { sortIncidentsByOperationalPriority, type Incident } from './incidents'

const incident = (
  id: string,
  severity: Incident['severity'],
  openedAt: string,
): Incident => ({
  id,
  title: id,
  serviceId: 'identity',
  region: 'de-fra-1',
  severity,
  openedAt,
  status: 'triage',
  customerImpact: 'Impact',
  nextAction: 'Action',
  runbookUrl: 'https://example.com/runbook',
})

describe('incident prioritization', () => {
  it('sorts by severity before age', () => {
    const sorted = sortIncidentsByOperationalPriority([
      incident('INC-3', 'sev3', '2026-06-20T10:00:00.000Z'),
      incident('INC-1', 'sev1', '2026-06-21T10:00:00.000Z'),
      incident('INC-2', 'sev2', '2026-06-19T10:00:00.000Z'),
    ])

    expect(sorted.map((entry) => entry.id)).toEqual(['INC-1', 'INC-2', 'INC-3'])
  })

  it('sorts incidents with equal severity by oldest open time first', () => {
    const sorted = sortIncidentsByOperationalPriority([
      incident('newer', 'sev2', '2026-06-21T10:00:00.000Z'),
      incident('older', 'sev2', '2026-06-19T10:00:00.000Z'),
    ])

    expect(sorted[0]?.id).toBe('older')
  })
})
