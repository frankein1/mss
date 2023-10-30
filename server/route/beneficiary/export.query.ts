import { Prisma } from '@prisma/client'
import {
  getBeneficiaryAccessibleData,
  getBeneficiaryExportData
} from './helper'
import { createQuery } from '~/server/route'
import { beneficiaryFieldLabels } from '~/client/labels'
import {
  ExportBeneficiariesInput,
  exportBeneficiariesSchema
} from '~/server/schema'
import {
  canExportBeneficiaries,
  SecurityRuleGrantee,
  BeneficiaryRules
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { RowType } from '~/types/export'
import { BENEFICIARY_RELATIONS_INCLUDE } from '~/utils/constants/beneficiary'
import { BENEFICIARY_EXPORTED_FIELDS } from '~/utils/constants/export'
import { createExport } from '~/utils/export/createExport'
import { prepareBeneficiaryFilters } from '~/utils/filters'
import { BeneficiaryRepo } from '~/server/database'

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

  const where: Prisma.BeneficiaryWhereInput = {
    ...prepareBeneficiaryFilters(input.filters)
  }

  const dataRequest = await BeneficiaryRepo.findMany(ctx.user, {
    where,
    orderBy: input.orderBy,
    include: BENEFICIARY_RELATIONS_INCLUDE
  })

  const rows: RowType[] = []

  for (const beneficiary of dataRequest) {
    if (BeneficiaryRules.select.general(ctx.user, beneficiary)) {
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
