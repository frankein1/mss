import { JobResult as PrismaJobResult } from '@prisma/client'
import {
  JobResult,
  DataInclusionStructureServerInput,
  CreateJobDataInclusionStructureInput,
  UpdateJobDataInclusionStructureInput
} from '~/server/schema'
import { DataInclusionStructureRepo, JobResultRepo } from '~/server/database'
import { prismaDecimalToNumber } from '~/utils/prisma'

export async function getStructureStatusInDB(id: number, updateDate: Date) {
  const structure = await DataInclusionStructureRepo.prisma.findFirst({
    where: { id }
  })

  const exists = structure !== null
  const shouldBeUpdated =
    exists &&
    structure.updated &&
    structure.updated.getTime() !== updateDate.getTime()

  return { exists, shouldBeUpdated }
}

export async function createStructure(
  structure: DataInclusionStructureServerInput,
  version: string
) {
  return await DataInclusionStructureRepo.prisma.create({
    data: {
      ...structure,
      version
    }
  })
}

export async function updateStructure(
  structure: DataInclusionStructureServerInput,
  version: string
) {
  return await DataInclusionStructureRepo.prisma.update({
    where: { id: structure.id },
    data: {
      ...structure,
      version
    }
  })
}

const jobConverter = (job: PrismaJobResult) =>
  ({
    ...job,
    durationInSeconds: prismaDecimalToNumber(job.durationInSeconds) || null,
    errors: job.errors || [],
    result: job.result
  }) as JobResult

export async function createJob(job: CreateJobDataInclusionStructureInput) {
  const res = await JobResultRepo.prisma.create({ data: job })

  return jobConverter(res)
}

export async function updateJob(job: UpdateJobDataInclusionStructureInput) {
  const res = await JobResultRepo.prisma.update({
    data: job,
    where: { id: job.id }
  })

  return jobConverter(res)
}
