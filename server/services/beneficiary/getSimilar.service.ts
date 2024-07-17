import { Prisma, UserStatus } from '@prisma/client'
import { GetSimilarBeneficiaryInput } from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database/repository'
import { BeneficiaryConstraints } from '~/server/database/constraints'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'
import {
  isReferent,
  isMemberOfReferents
} from '~/server/security/rules/helpers'

function prepareSimilarFilter({
  firstName,
  usualName,
  birthDate
}: GetSimilarBeneficiaryInput): Prisma.BeneficiaryWhereInput {
  const usualNameComp: Prisma.BeneficiaryWhereInput['usualName'] = {
    equals: usualName,
    mode: 'insensitive'
  }
  const firstNameComp: Prisma.BeneficiaryWhereInput['firstName'] = {
    equals: firstName,
    mode: 'insensitive'
  }
  const usualNameAndBirthDateComp = {
    usualName: usualNameComp,
    birthDate
  }
  const usualNameAndFirstNameComp = {
    usualName: usualNameComp,
    firstName: firstNameComp
  }

  if (!firstName) {
    return usualNameAndBirthDateComp
  }
  if (!birthDate) {
    return usualNameAndFirstNameComp
  }
  return {
    OR: [usualNameAndBirthDateComp, usualNameAndFirstNameComp]
  }
}

export async function getSimilar({
  ctx: { user },
  input
}: {
  ctx: SecurityRuleContext
  input: GetSimilarBeneficiaryInput
}) {
  const params: { where: Prisma.BeneficiaryWhereInput } = {
    where: prepareSimilarFilter(input)
  }

  appendConstraints(user, params, BeneficiaryConstraints.get)

  // Remove the referent constraint
  if (params.where.familyFile) {
    params.where.familyFile.referents = undefined
  }

  params.where.status = UserStatus.Active

  const similarBeneficiaries = await BeneficiaryRepo.prisma.findMany({
    ...params,
    select: {
      id: true,
      firstName: true,
      usualName: true,
      birthName: true,
      birthDate: true,
      familyFile: {
        select: {
          referents: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  })

  if (!similarBeneficiaries.length) {
    return undefined
  }

  if (!isReferent(user)) {
    return { ...similarBeneficiaries[0], referent: undefined }
  }

  const similarWithReferent = similarBeneficiaries.find(s =>
    isMemberOfReferents(user, s.familyFile)
  )

  if (similarWithReferent) {
    return { ...similarWithReferent, referent: undefined }
  }

  const similarBeneficiary = similarBeneficiaries[0]

  return {
    ...similarBeneficiary,
    referent: similarBeneficiary.familyFile.referents[0]
  }
}
