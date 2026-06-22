import { describe, expect, it } from 'vitest'

import { calculateServiceRisk, summarizeReadiness, type CloudService } from './readiness'

const service: CloudService = {
  id: 'identity',
  name: 'Identity',
  owner: 'Platform',
  region: 'de-fra-1',
  status: 'operational',
  availabilityTarget: 99.9,
  availabilityActual: 99.95,
  p95LatencyMs: 180,
  errorRate: 0.02,
  lastDeploy: '2026-06-20T10:00:00.000Z',
  wcagRisk: 'low',
  dependencies: [],
}

describe('readiness domain rules', () => {
  it('keeps a healthy service at zero risk', () => {
    expect(calculateServiceRisk(service)).toBe(0)
  })

  it('penalizes degraded critical dependencies', () => {
    expect(
      calculateServiceRisk({
        ...service,
        dependencies: [
          {
            id: 'storage',
            name: 'Storage',
            criticality: 'high',
            status: 'degraded',
          },
        ],
      }),
    ).toBeGreaterThan(10)
  })

  it('summarizes an empty service list as at risk', () => {
    expect(summarizeReadiness([])).toMatchObject({
      score: 0,
      status: 'at-risk',
    })
  })

  it('summarizes mixed service health into a watch state', () => {
    const summary = summarizeReadiness([
      service,
      {
        ...service,
        id: 'learning',
        status: 'degraded',
        availabilityActual: 99.7,
        p95LatencyMs: 650,
      },
    ])

    expect(summary.status).toBe('watch')
    expect(summary.impactedServices).toBe(1)
  })
})
