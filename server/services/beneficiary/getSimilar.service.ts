import { Prisma } from '@prisma/client'
import { GetSimilarBeneficiariesInput } from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database/repository'
import { BeneficiaryConstraints } from '~/server/database/constraints'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

function prepareSimilarFilter({
  firstName,
  usualName,
  birthDate
}: GetSimilarBeneficiariesInput): Prisma.BeneficiaryWhereInput {
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

export function getSimilar({
  ctx: { user },
  input
}: {
  ctx: SecurityRuleContext
  input: GetSimilarBeneficiariesInput
}) {
  const params: { where: Prisma.BeneficiaryWhereInput } = {
    where: prepareSimilarFilter(input)
  }

  appendConstraints(user, params, BeneficiaryConstraints.get)

  // Remove the referent constraint
  Object.assign(params, { referents: undefined })

  return BeneficiaryRepo.prisma.findMany({
    ...params,
    select: {
      id: true,
      firstName: true,
      usualName: true,
      birthName: true,
      birthDate: true
    }
  })
}
