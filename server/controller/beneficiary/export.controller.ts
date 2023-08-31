import { Prisma } from '@prisma/client'
import { beneficiaryFieldLabels } from '~/client/labels'
import { prismaClient } from '~/server/prisma'
import { ExportBeneficiariesInput } from '~/server/schema'
import {
  canOnlyListItsBeneficiaries,
  canViewBeneficiary,
  canExportBeneficiaries
} from '~/server/security/rules'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { RowType } from '~/types/export'
import { getBeneficiaryAccessibleData } from '~/utils/beneficiary/getBeneficiaryAccessibleData'
import { BENEFICIARY_RELATIONS_INCLUDE } from '~/utils/constants/beneficiary'
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
    ...prepareBeneficiaryFilters(
      input.filters,
      canOnlyListItsBeneficiaries(user)
    )
  }

  const dataRequest = await prismaClient.beneficiary.findMany({
    where,
    orderBy: input.orderBy,
    include: BENEFICIARY_RELATIONS_INCLUDE
  })

  const rows: RowType[] = []

  for (const beneficiary of dataRequest) {
    if (canViewBeneficiary(user, beneficiary)) {
      const withPermissionsBeneficiary = await getBeneficiaryAccessibleData(
        user,
        beneficiary
      )
      rows.push(getBeneficiaryExportData(withPermissionsBeneficiary))
    }
  }

  return await createExport(user.id, [{ name: 'Bénéficiaires', columns, rows }])
}
