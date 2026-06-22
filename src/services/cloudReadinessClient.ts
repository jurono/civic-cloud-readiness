import type { Incident } from '@/domain/incidents'
import type { CloudService } from '@/domain/readiness'
import { cloudServices, incidents } from './fixtures'

export interface CloudReadinessClient {
  listServices(): Promise<CloudService[]>
  listIncidents(): Promise<Incident[]>
}

export class FixtureCloudReadinessClient implements CloudReadinessClient {
  async listServices(): Promise<CloudService[]> {
    return structuredClone(cloudServices)
  }

  async listIncidents(): Promise<Incident[]> {
    return structuredClone(incidents)
  }
}

export const cloudReadinessClient = new FixtureCloudReadinessClient()
