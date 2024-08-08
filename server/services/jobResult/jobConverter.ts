import { JobResult as PrismaJobResult } from '@prisma/client'
import { JobResult } from '~/server/schema'
import { prismaDecimalToNumber } from '~/utils/prisma'

export const jobConverter = (job: PrismaJobResult) =>
  ({
    ...job,
    durationInSeconds: prismaDecimalToNumber(job.durationInSeconds) || null,
    errors: job.errors || [],
    result: job.result
  }) as JobResult
