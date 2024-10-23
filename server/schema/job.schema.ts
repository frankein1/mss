import { z } from 'zod'
import { Prisma, JobStatus } from '@prisma/client'
import { maxStringLengthMessage } from '~/utils/zod'
import {
  paginatedSchema,
  stringConstraint
} from '~/server/schema/helpers.schema'
import { jobResultAdminFilterSchema } from '~/server/schema/filter.schema'

const jobInternalResultSchema = z.object({
  nImported: z.number().optional(),
  // Data Inclusion
  nTotal: z.number().optional(),
  nInDatabase: z.number().optional(),
  nCreated: z.number().optional(),
  nUpdated: z.number().optional(),
  // Brevo
  processId: z.number().nullable().optional(),
  exportStartDate: z.date().nullable().optional()
})

type JobInternalResult = z.infer<typeof jobInternalResultSchema>

const jobErrorSchema = z.object({
  category: z.enum([
    'structure-import-download',
    'structure-import-format',
    'structure-import-create',
    'structure-import-update',
    'structure-import-other',
    'brevo-export'
  ]),
  status: z.number().nullable(),
  error: z.string()
})

type JobError = z.infer<typeof jobErrorSchema>

const createJobResultSchema = z.object({
  name: z.enum([
    'data-inclusion-structure-import-cron',
    'data-inclusion-structure-import',
    'brevo-export'
  ]),
  errors: z.array(jobErrorSchema),
  result: jobInternalResultSchema
})

export type CreateJobResultInput = z.infer<typeof createJobResultSchema>

export type UpdateJobResultInput = (
  | {
      id: string
      status: 'Failure' | 'Success'
      durationInSeconds?: number
      endDate: Date
    }
  | {
      id: string
      status: 'Ongoing'
    }
) & {
  errors: JobError[]
  result: JobInternalResult
}

export interface JobResult {
  id: string
  name: string
  status: JobStatus
  startDate: Date
  endDate: Date | null
  durationInSeconds: number | null
  errors: JobError[]
  result: JobInternalResult
}

export const adminGetJobResultsSchema = z
  .object({
    name: stringConstraint.max(50, maxStringLengthMessage(50)).nullish(),
    // search: stringConstraint.max(20, maxStringLengthMessage(20)).nullish(),
    filters: jobResultAdminFilterSchema,
    orderBy: z.object({
      startDate: z.nativeEnum(Prisma.SortOrder).optional()
    })
  })
  .merge(paginatedSchema)

export type AdminGetJobResultsInput = z.infer<typeof adminGetJobResultsSchema>
