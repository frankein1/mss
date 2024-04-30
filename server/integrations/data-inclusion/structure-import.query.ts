import { JobResult } from './types'
import { DataInclusionStructureRepo, JobResultRepo } from '~/server/database'
import {
  DataInclusionStructureServerInput,
  CreateJobDataInclusionStructureInput,
  UpdateJobDataInclusionStructureInput
} from '~/server/schema'
import { prismaDecimalToNumber } from '~/utils/prisma'

export async function getStructureStatusInDB(id: string, updateDate: Date) {
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

export async function createJob(job: CreateJobDataInclusionStructureInput) {
  const res = await JobResultRepo.prisma.create({ data: job })

  return {
    ...res,
    durationInSeconds: prismaDecimalToNumber(res.durationInSeconds) || null,
    errors: res.errors || [],
    result: res.result
  } as JobResult
}

export async function updateJob(job: UpdateJobDataInclusionStructureInput) {
  return await JobResultRepo.prisma.update({
    data: job,
    where: { id: job.id }
  })
}
