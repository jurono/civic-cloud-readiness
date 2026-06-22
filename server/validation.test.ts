import { describe, expect, it } from 'vitest'

import { cloudServices } from './data'
import { parseIncidentReport } from './validation'

describe('incident report validation', () => {
  it('accepts a valid incident report', () => {
    const result = parseIncidentReport(
      {
        title: 'Benefits workflow unavailable',
        serviceId: 'benefits',
        region: 'de-fra-1',
        severity: 'sev1',
        customerImpact: 'Applicants cannot submit benefits forms.',
        nextAction: 'Fail over form renderer to the standby cluster.',
        runbookUrl: 'https://example.com/runbooks/forms',
      },
      cloudServices,
    )

    expect(result.ok).toBe(true)
  })

  it('rejects reports for unknown services', () => {
    const result = parseIncidentReport(
      {
        title: 'Unknown service problem',
        serviceId: 'missing',
        region: 'de-fra-1',
        severity: 'sev2',
        customerImpact: 'Users are seeing failed requests.',
        nextAction: 'Escalate to platform support.',
        runbookUrl: 'https://example.com/runbooks/forms',
      },
      cloudServices,
    )

    expect(result).toEqual({ ok: false, message: 'Unknown service.' })
  })
})
