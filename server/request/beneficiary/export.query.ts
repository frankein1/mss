import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/request'
import { beneficiaryFieldLabels } from '~/client/labels'
import { prismaClient } from '~/server/prisma'
import {
  ExportBeneficiariesInput,
  exportBeneficiariesSchema
} from '~/server/schema'
import {
  canOnlyListItsBeneficiaries,
  canViewBeneficiary,
  canExportBeneficiaries,
  SecurityRuleGrantee
} from '~/server/security/rules'
import { ProtectedAppContext } from '~/server/trpc'
import { RowType } from '~/types/export'
import { getBeneficiaryAccessibleData } from '~/server/route/beneficiary/helper/getBeneficiaryAccessibleData'
import { BENEFICIARY_RELATIONS_INCLUDE } from '~/utils/constants/beneficiary'
import { BENEFICIARY_EXPORTED_FIELDS } from '~/utils/constants/export'
import { createExport } from '~/utils/export/createExport'
import { getBeneficiaryExportData } from '~/server/route/beneficiary/helper/getBeneficiaryExportData'
import { prepareBeneficiaryFilters } from '~/utils/filters'

const securityCheck = (
  grantee: SecurityRuleGrantee,
  _input: ExportBeneficiariesInput
) => {
  return canExportBeneficiaries(grantee)
}

const handler = async ({
  input,
  ctx
}: {
  input: ExportBeneficiariesInput
  ctx: ProtectedAppContext
}) => {
  const columns = BENEFICIARY_EXPORTED_FIELDS.map(key => ({
    key,
    header: beneficiaryFieldLabels[key]
  }))

  const referentsCondition = canOnlyListItsBeneficiaries(ctx.user)
    ? { some: { id: ctx.user.id } }
    : undefined

  const where: Prisma.BeneficiaryWhereInput = {
    structureId: ctx.structure.id,
    archived: null,
    referents: referentsCondition,
    ...prepareBeneficiaryFilters(
      input.filters,
      canOnlyListItsBeneficiaries(ctx.user)
    )
  }

  const dataRequest = await prismaClient.beneficiary.findMany({
    where,
    orderBy: input.orderBy,
    include: BENEFICIARY_RELATIONS_INCLUDE
  })

  const rows: RowType[] = []

  for (const beneficiary of dataRequest) {
    if (canViewBeneficiary(ctx.user, beneficiary)) {
      const withPermissionsBeneficiary = getBeneficiaryAccessibleData(
        ctx,
        beneficiary
      )
      rows.push(getBeneficiaryExportData(withPermissionsBeneficiary))
    }
  }

  return await createExport(ctx.user.id, [
    { name: 'Bénéficiaires', columns, rows }
  ])
}

export const exportBeneficiariesQuery = createQuery({
  inputValidation: exportBeneficiariesSchema,
  securityCheck,
  handler
})
