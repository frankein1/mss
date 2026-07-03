import type { Prisma } from '@prisma/client'
import {
  fixturesBeneficiaries,
  FixtureBeneficiary,
  fixturesSupportProgramNames,
  FixtureProgramName
} from '.'

export const fixturesSupportPrograms: Prisma.SupportProgramCreateManyInput[] = [
  {
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id,
    supportProgramNameId:
      fixturesSupportProgramNames[FixtureProgramName.PortageRepas].id,
    startDate: new Date('2025-03-01'),
    endDate: null
  },
  {
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.PENSON].id,
    supportProgramNameId:
      fixturesSupportProgramNames[FixtureProgramName.PortageRepas].id,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2025-07-01')
  },
  {
    // WONFAR has two program enrollments with the same name
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.WONFAR].id,
    supportProgramNameId:
      fixturesSupportProgramNames[FixtureProgramName.PortageRepas].id,
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-04-01')
  },
  {
    // Statistics should deduplicate this second enrollment to count unique beneficiaries
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.WONFAR].id,
    supportProgramNameId:
      fixturesSupportProgramNames[FixtureProgramName.PortageRepas].id,
    startDate: new Date('2025-05-01'),
    endDate: null
  },
  {
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id,
    supportProgramNameId:
      fixturesSupportProgramNames[FixtureProgramName.AideDomicile].id,
    startDate: new Date('2025-02-01'),
    endDate: null
  },
  {
    beneficiaryId: fixturesBeneficiaries[FixtureBeneficiary.HEINIG].id,
    supportProgramNameId:
      fixturesSupportProgramNames[FixtureProgramName.AideDomicile].id,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-08-01')
  }
]
