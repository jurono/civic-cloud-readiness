import type { ReadinessSummary, ServiceStatus } from '@/domain/readiness'

export function getReadinessTone(status: ReadinessSummary['status'] | ServiceStatus) {
  if (status === 'ready' || status === 'operational') return 'ok'
  if (status === 'watch' || status === 'degraded' || status === 'maintenance')
    return 'warning'
  return 'danger'
}
