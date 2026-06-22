import cors from 'cors'
import express from 'express'
import { randomUUID } from 'node:crypto'

import type { Incident } from '../src/domain/incidents'
import { cloudServices, incidents } from './data'
import { parseIncidentReport } from './validation'

const app = express()
const port = Number(process.env.API_PORT ?? 8787)

app.use(cors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.get('/services', (_request, response) => {
  response.json(cloudServices)
})

app.get('/incidents', (_request, response) => {
  response.json(incidents)
})

app.post('/incidents', (request, response) => {
  const parsed = parseIncidentReport(request.body, cloudServices)

  if (!parsed.ok) {
    response.status(400).json({ message: parsed.message })
    return
  }

  const incident: Incident = {
    id: `INC-${randomUUID().slice(0, 8).toUpperCase()}`,
    openedAt: new Date().toISOString(),
    status: 'triage',
    ...parsed.report,
  }

  incidents.unshift(incident)
  response.status(201).json(incident)
})

app.use((_request, response) => {
  response.status(404).json({ message: 'Not found' })
})

app.listen(port, () => {
  console.log(`Civic Cloud Readiness API listening on http://localhost:${port}`)
})
