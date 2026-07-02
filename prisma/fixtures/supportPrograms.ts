import type { Prisma } from '@prisma/client'
import {
  fixturesBeneficiaries,
  FixtureBeneficiary,
  fixturesSupportProgramNames
} from '.'

export const fixturesSupportPrograms: Prisma.SupportProgramCreateManyInput[] = [
  // "Portage de repas" — 3 distinct beneficiaries (COURSOR, PENSON, WONFAR)
  {
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id,
    supportProgramNameId: fixturesSupportProgramNames[0].id
  },
  {
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.PENSON].id,
    supportProgramNameId: fixturesSupportProgramNames[0].id
  },
  {
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.WONFAR].id,
    supportProgramNameId: fixturesSupportProgramNames[0].id
  },
  // WONFAR second enrollment in same program — tests deduplication
  {
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.WONFAR].id,
    supportProgramNameId: fixturesSupportProgramNames[0].id
  },
  // "Aide à domicile" — 2 distinct beneficiaries (COURSOR, HEINIG)
  {
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id,
    supportProgramNameId: fixturesSupportProgramNames[1].id
  },
  {
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.HEINIG].id,
    supportProgramNameId: fixturesSupportProgramNames[1].id
  }
]
