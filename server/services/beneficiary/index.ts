import { Prisma } from '@prisma/client'
import { create } from './create.service'
import { getBeneficiarySecurityTarget } from './getSecurityTarget.service'
import { findBeneficiaries, findBeneficiary } from './find.service'
import { updateTaxHousehold } from './updateTaxHousehold.service'

export const BeneficiaryService = {
  create,
  getBeneficiarySecurityTarget,
  findBeneficiary,
  findBeneficiaries,
  updateTaxHousehold
}

export type BeneficiarySecurityTarget = Prisma.PromiseReturnType<
  typeof getBeneficiarySecurityTarget
>
