import { z } from 'zod'
import { JobStatus } from '@prisma/client'

export const dataInclusionStructureImportResultSchema = z.object({
  nToImport: z.number(),
  nImported: z.number(),
  nCreated: z.number(),
  nUpdated: z.number()
})

export type JobStructureImportResult = z.infer<
  typeof dataInclusionStructureImportResultSchema
>

export const dataInclusionStructureErrorSchema = z.object({
  category: z.enum([
    'structure-import-download',
    'structure-import-format',
    'structure-import-create',
    'structure-import-update',
    'structure-import-other'
  ]),
  status: z.number().nullable(),
  error: z.string()
})

export type JobStructureImportError = z.infer<
  typeof dataInclusionStructureErrorSchema
>

export const createJobDataInclusionStructureSchema = z.object({
  name: z.string(),
  errors: z.array(dataInclusionStructureErrorSchema),
  result: dataInclusionStructureImportResultSchema
})

export type CreateJobDataInclusionStructureInput = z.infer<
  typeof createJobDataInclusionStructureSchema
>

export interface UpdateJobDataInclusionStructureInput {
  id: string
  status: JobStatus
  durationInSeconds: number
  endDate: Date
  errors: JobStructureImportError[]
  result: JobStructureImportResult
}

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
