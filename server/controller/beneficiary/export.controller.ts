import { Prisma } from '@prisma/client'
import { beneficiaryFieldLabels } from '~/client/labels'
import { prismaClient } from '~/server/prisma'
import { ExportBeneficiariesInput } from '~/server/schema/beneficiary.schema'
import {
  canOnlyListItsBeneficiaries,
  canViewBeneficiary
} from '~/server/security/rules'
import { canExportBeneficiaries } from '~/server/security/rules/export'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { RowType } from '~/types/export'
import { getBeneficiaryAccessibleData } from '~/utils/beneficiary/getBeneficiaryAccessibleData'
import { BENEFICIARY_EXPORTED_FIELDS } from '~/utils/constants/export'
import { createExport } from '~/utils/export/createExport'
import { getBeneficiaryExportData } from '~/utils/export/getBeneficiaryExportData'
import { prepareBeneficiaryFilters } from '~/utils/filters'

export const exportBeneficiariesHandler = async ({
  input,
  ctx: { user }
}: {
  input: ExportBeneficiariesInput
  ctx: ProtectedAppContext
}) => {
  if (!canExportBeneficiaries(user)) {
    throw forbiddenError()
  }

  const columns = BENEFICIARY_EXPORTED_FIELDS.map(key => ({
    key,
    header: beneficiaryFieldLabels[key]
  }))

  const referentsCondition = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  const where: Prisma.BeneficiaryWhereInput = {
    structureId: user.structureId,
    archived: null,
    referents: referentsCondition,
    ...prepareBeneficiaryFilters(input.filters)
  }

  const dataRequest = await prismaClient.beneficiary.findMany({
    where,
    orderBy: input.orderBy,
    include: {
      referents: true,
      relatives: {
        include: {
          linkedBeneficiary: true
        }
      },
      documents: true,
      followups: {
        include: {
          types: true
        }
      },
      helpRequests: {
        include: {
          type: true
        }
      }
    }
  })

  const data: RowType[] = []

  for (const beneficiary of dataRequest) {
    if (canViewBeneficiary(user, beneficiary)) {
      const withPermissionsBeneficiary = await getBeneficiaryAccessibleData(
        user,
        beneficiary
      )
      data.push(getBeneficiaryExportData(withPermissionsBeneficiary))
    }
  }

  return await createExport('Bénéficiaires', columns, data, user.id)
}
