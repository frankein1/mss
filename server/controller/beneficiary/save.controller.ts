import { UserActivityType } from '@prisma/client'
import { SaveBeneficiaryInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { getUserStructureType } from '~/server/security'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { canSaveBeneficiaryWithCompleteInfo } from 'server/security/rules/beneficiary'
import { canSetBeneficiaryNir } from 'server/security/rules'

export const saveBeneficiaryHandler = async ({
  input,
  ctx: { user }
}: {
  input: SaveBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  const {
    referents,
    aidantConnectAuthorized,
    general,
    health: { socialSecurityNumber, ...otherHealthInfo },
    external,
    occupation,
    taxHousehold,
    entourage
  } = input

  const fileNumber = generateFileNumber()

  let data = {
    structureId: user.structureId,
    fileNumber,
    aidantConnectAuthorized,
    ...general,
    referents: {
      connect: referents.map(referent => ({ id: referent }))
    },
    createdById: user.id
  } as any

  if (canSaveBeneficiaryWithCompleteInfo(user)) {
    const { taxHouseholds: _, ...taxHouseholdDatas } = taxHousehold

    const userStructureType = await getUserStructureType(user)

    if (canSetBeneficiaryNir(userStructureType)) {
      data = { ...data, socialSecurityNumber }
    }

    const entourages =
      entourage.entourages?.map(e => ({ hosted: false, ...e })) || []
    const taxHouseholds =
      taxHousehold.taxHouseholds?.map(e => {
        const { linkedBeneficiary, ...data } = e
        return {
          hosted: true,
          linkedBeneficiaryId: linkedBeneficiary ? linkedBeneficiary.id : null,
          ...data
        }
      }) || []

    const newRelatives = [...entourages, ...taxHouseholds]

    data = {
      ...data,
      ...otherHealthInfo,
      ...external,
      ...occupation,
      ...taxHouseholdDatas,
      relatives: {
        create: newRelatives
      }
    }
  }

  const savedBeneficiary = await prismaClient.beneficiary.create({
    data
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.CREATE,
    object: 'Beneficiary',
    objectId: savedBeneficiary.id
  })

  return { id: savedBeneficiary.id }
}
