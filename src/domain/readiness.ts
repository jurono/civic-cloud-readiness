export type Region = 'de-fra-1' | 'de-ber-1' | 'eu-ams-1'

export type ServiceStatus = 'operational' | 'degraded' | 'maintenance' | 'incident'

export interface ServiceDependency {
  id: string
  name: string
  criticality: 'low' | 'medium' | 'high'
  status: ServiceStatus
}

export interface CloudService {
  id: string
  name: string
  owner: string
  region: Region
  status: ServiceStatus
  availabilityTarget: number
  availabilityActual: number
  p95LatencyMs: number
  errorRate: number
  lastDeploy: string
  dependencies: ServiceDependency[]
  wcagRisk: 'low' | 'medium' | 'high'
}

export interface ReadinessSummary {
  score: number
  status: 'ready' | 'watch' | 'at-risk'
  impactedServices: number
  avgLatencyMs: number
  avgAvailability: number
}

const statusPenalty: Record<ServiceStatus, number> = {
  operational: 0,
  maintenance: 7,
  degraded: 18,
  incident: 35,
}

const accessibilityPenalty: Record<CloudService['wcagRisk'], number> = {
  low: 0,
  medium: 6,
  high: 14,
}

export function calculateServiceRisk(service: CloudService): number {
  const availabilityGap =
    Math.max(0, service.availabilityTarget - service.availabilityActual) * 30
  const latencyPenalty =
    service.p95LatencyMs > 600 ? 10 : service.p95LatencyMs > 350 ? 5 : 0
  const errorPenalty = service.errorRate > 1 ? 12 : service.errorRate > 0.3 ? 5 : 0
  const dependencyPenalty = service.dependencies.reduce((total, dependency) => {
    const criticalityWeight =
      dependency.criticality === 'high'
        ? 1
        : dependency.criticality === 'medium'
          ? 0.6
          : 0.25
    return total + statusPenalty[dependency.status] * criticalityWeight
  }, 0)

  return Math.min(
    100,
    Math.round(
      statusPenalty[service.status] +
        accessibilityPenalty[service.wcagRisk] +
        availabilityGap +
        latencyPenalty +
        errorPenalty +
        dependencyPenalty,
    ),
  )
}

export function summarizeReadiness(services: CloudService[]): ReadinessSummary {
  if (services.length === 0) {
    return {
      score: 0,
      status: 'at-risk',
      impactedServices: 0,
      avgLatencyMs: 0,
      avgAvailability: 0,
    }
  }

  const totalRisk = services.reduce(
    (sum, service) => sum + calculateServiceRisk(service),
    0,
  )
  const score = Math.max(0, Math.round(100 - totalRisk / services.length))
  const impactedServices = services.filter(
    (service) => service.status !== 'operational',
  ).length
  const avgLatencyMs = Math.round(
    services.reduce((sum, service) => sum + service.p95LatencyMs, 0) / services.length,
  )
  const avgAvailability = Number(
    (
      services.reduce((sum, service) => sum + service.availabilityActual, 0) /
      services.length
    ).toFixed(2),
  )

  return {
    score,
    status: score >= 88 ? 'ready' : score >= 72 ? 'watch' : 'at-risk',
    impactedServices,
    avgLatencyMs,
    avgAvailability,
  }
}
