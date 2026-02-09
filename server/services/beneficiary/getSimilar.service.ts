import type { Prisma } from '~/prisma/generated/client'
import { UserStatus } from '~/prisma/generated/client'
import type { GetSimilarBeneficiaryInput } from '~/server/schema'
import { BeneficiaryRepo } from '~/server/database/repository'
import { BeneficiaryConstraints } from '~/server/database/constraints'
import type { SecurityRuleContext } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'
import {
  isReferent,
  isMemberOfReferents
} from '~/server/security/rules/helpers'

function prepareSimilarFilter({
  firstName,
  usualName,
  birthName,
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
  const birthNameComp: Prisma.BeneficiaryWhereInput['birthName'] = {
    equals: birthName,
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
  const birthNameAndBirthDateComp = {
    birthName: birthNameComp,
    birthDate
  }
  const birthNameAndFirstNameComp = {
    birthName: birthNameComp,
    firstName: firstNameComp
  }
  const birthNameAndUsualNameComp = {
    birthName: birthNameComp,
    usualName: usualNameComp
  }

  if ((!usualName || usualName === '') && (!birthName || birthName === '')) {
    throw new Error('Should receive at least usualName or birthName')
  }

  if (usualName && birthName) {
    if (!firstName) {
      return {
        OR: [
          usualNameAndBirthDateComp,
          birthNameAndUsualNameComp,
          birthNameAndBirthDateComp
        ]
      }
    }
    if (!birthDate) {
      return {
        OR: [
          usualNameAndFirstNameComp,
          birthNameAndUsualNameComp,
          birthNameAndFirstNameComp
        ]
      }
    }
    return {
      OR: [
        usualNameAndBirthDateComp,
        usualNameAndFirstNameComp,
        birthNameAndBirthDateComp,
        birthNameAndFirstNameComp,
        birthNameAndUsualNameComp
      ]
    }
  }

  if (usualName) {
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

  if (!firstName) {
    return birthNameAndBirthDateComp
  }
  if (!birthDate) {
    return birthNameAndFirstNameComp
  }
  return {
    OR: [birthNameAndBirthDateComp, birthNameAndFirstNameComp]
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
          id: true,
          referents: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              status: true
            }
          }
        }
      }
    }
  })

  if (!similarBeneficiaries.length) {
    return undefined
  }
  const similarBeneficiary = similarBeneficiaries[0]

  // Si utilisateur n'a pas le rôle Référent,
  // pas besoin de transmettre le nom du référent du dossier
  if (!isReferent(user)) {
    return { ...similarBeneficiary, referent: undefined }
  }

  const similarWithReferent = similarBeneficiaries.find(s =>
    isMemberOfReferents(user, s.familyFile)
  )

  // Si utilisateur a le rôle est Référent et qu'il est référent du dossier,
  // pas besoin de transmettre le nom du référent du dossier
  if (similarWithReferent) {
    return { ...similarWithReferent, referent: undefined }
  }

  // Si utilisateur a le rôle est Référent et qu'il n'est pas référent du dossier,
  // on transmet le nom du référent du dossier
  return {
    ...similarBeneficiary,
    referent:
      similarBeneficiary?.familyFile.referents[0] &&
      similarBeneficiary.familyFile.referents[0].status === UserStatus.Active
        ? similarBeneficiary.familyFile.referents[0]
        : undefined
  }
}
