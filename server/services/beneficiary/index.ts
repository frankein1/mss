import { Prisma } from '@prisma/client'
import { create } from './create.method'
import { getBeneficiarySecurityTarget } from './getSecurityTarget.method'
import { findBeneficiaries, findBeneficiary } from './find.method'

export const BeneficiaryService = {
  create,
  getBeneficiarySecurityTarget,
  findBeneficiary,
  findBeneficiaries
}

export type BeneficiarySecurityTarget = Prisma.PromiseReturnType<
  typeof getBeneficiarySecurityTarget
>
