import type { Incident, NewIncidentReport } from '@/domain/incidents'
import type { CloudService } from '@/domain/readiness'

export interface CloudReadinessClient {
  listServices(): Promise<CloudService[]>
  listIncidents(): Promise<Incident[]>
  reportIncident(report: NewIncidentReport): Promise<Incident>
}

export class HttpCloudReadinessClient implements CloudReadinessClient {
  constructor(
    private readonly baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787',
  ) {}

  async listServices(): Promise<CloudService[]> {
    return this.request<CloudService[]>('/services')
  }

  async listIncidents(): Promise<Incident[]> {
    return this.request<Incident[]>('/incidents')
  }

  async reportIncident(report: NewIncidentReport): Promise<Incident> {
    return this.request<Incident>('/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    })
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, init)

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      const message =
        payload && typeof payload.message === 'string'
          ? payload.message
          : `API request failed with ${response.status}`
      throw new Error(message)
    }

    return response.json() as Promise<T>
  }
}

export const cloudReadinessClient = new HttpCloudReadinessClient()
