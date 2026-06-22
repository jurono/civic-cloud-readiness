import type { NewIncidentReport } from '../src/domain/incidents'
import type { CloudService, Region } from '../src/domain/readiness'

const severities = ['sev1', 'sev2', 'sev3'] as const
const regions = ['de-fra-1', 'de-ber-1', 'eu-ams-1'] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null
}

export function parseIncidentReport(
  body: unknown,
  services: CloudService[],
): { ok: true; report: NewIncidentReport } | { ok: false; message: string } {
  if (!isRecord(body)) return { ok: false, message: 'Expected a JSON request body.' }

  const title = readString(body.title)
  const serviceId = readString(body.serviceId)
  const customerImpact = readString(body.customerImpact)
  const nextAction = readString(body.nextAction)
  const runbookUrl = readString(body.runbookUrl)

  if (!title || title.length < 8) {
    return { ok: false, message: 'Title must contain at least 8 characters.' }
  }

  const service = services.find((entry) => entry.id === serviceId)
  if (!service) return { ok: false, message: 'Unknown service.' }

  if (!severities.includes(body.severity as (typeof severities)[number])) {
    return { ok: false, message: 'Unknown severity.' }
  }

  const region = body.region ?? service.region
  if (!regions.includes(region as Region)) {
    return { ok: false, message: 'Unknown region.' }
  }

  if (!customerImpact || customerImpact.length < 12) {
    return { ok: false, message: 'Customer impact must contain at least 12 characters.' }
  }

  if (!nextAction || nextAction.length < 8) {
    return { ok: false, message: 'Next action must contain at least 8 characters.' }
  }

  if (!runbookUrl || !URL.canParse(runbookUrl)) {
    return { ok: false, message: 'Runbook URL must be a valid URL.' }
  }

  return {
    ok: true,
    report: {
      title,
      serviceId: service.id,
      region: region as Region,
      severity: body.severity as NewIncidentReport['severity'],
      customerImpact,
      nextAction,
      runbookUrl,
    },
  }
}
