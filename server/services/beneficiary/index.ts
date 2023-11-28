import { Prisma } from '@prisma/client'
import { create } from './create.method'
import { getBeneficiarySecurityTarget } from './getSecurityTarget.method'
import { findBeneficiaries, findBeneficiary } from './find.method'
import { updateTaxHousehold } from './updateTaxHousehold.method'

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
