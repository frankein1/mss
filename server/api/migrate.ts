import { defineEventHandler, readBody } from 'h3'
import { prismaClient } from '../prisma'
import { BeneficiaryRepo } from '../database'
import { forbiddenError } from '~/server/trpc'
import { JwtUser } from '~/types/user'
import { generateFileNumber } from '~/utils/generateFileNumber'

export default defineEventHandler(async event => {
  const { user }: { user: JwtUser } = event.context.auth
  if (!user || user.role !== 'Administrator') {
    throw forbiddenError()
  }

  const { exec } = await readBody(event)

  const raw =
    await prismaClient.$queryRaw`SELECT id,file_number FROM "public"."beneficiary" WHERE LENGTH(file_number) > 10`

  const beneficiaries = raw as { id: string; file_number: string }[]

  if (exec) {
    const promises = beneficiaries.map(async b => {
      await BeneficiaryRepo.prisma.update({
        where: { id: b.id },
        data: { fileNumber: generateFileNumber() }
      })
    })

    await Promise.all(promises)
  }

  return beneficiaries
})
