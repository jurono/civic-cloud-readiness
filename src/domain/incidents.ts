import type { Region } from './readiness'

export type IncidentSeverity = 'sev1' | 'sev2' | 'sev3'

export interface Incident {
  id: string
  title: string
  serviceId: string
  region: Region
  severity: IncidentSeverity
  openedAt: string
  status: 'triage' | 'mitigating' | 'monitoring' | 'resolved'
  customerImpact: string
  nextAction: string
  runbookUrl: string
}

export type NewIncidentReport = Pick<
  Incident,
  | 'title'
  | 'serviceId'
  | 'region'
  | 'severity'
  | 'customerImpact'
  | 'nextAction'
  | 'runbookUrl'
>

export function sortIncidentsByOperationalPriority(incidents: Incident[]): Incident[] {
  const severityOrder: Record<IncidentSeverity, number> = {
    sev1: 0,
    sev2: 1,
    sev3: 2,
  }

  return [...incidents].sort((a, b) => {
    const severityDelta = severityOrder[a.severity] - severityOrder[b.severity]
    if (severityDelta !== 0) return severityDelta
    return new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime()
  })
}
