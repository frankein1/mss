import type { JobStatus } from '@prisma/client'
import {
  JobStructureImportError,
  JobStructureImportResult
} from '~/server/schema'

export interface JobResult {
  id: string
  name: string
  status: JobStatus
  startDate: Date
  endDate: Date | null
  durationInSeconds: number | null
  errors: JobStructureImportError[]
  result: JobStructureImportResult
}
