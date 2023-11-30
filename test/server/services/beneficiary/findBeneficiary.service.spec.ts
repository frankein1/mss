import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  UserRole,
  UserStatus,
  StructureType,
  BeneficiaryAccommodationZone,
  BeneficiaryMinistereCategorie,
  BeneficiaryMinistereDepartementServiceAc,
  BeneficiaryMinistereStructure,
  BeneficiaryStatus,
  BeneficiaryProtectionMeasure,
  BeneficiaryFamilySituation,
  BeneficiaryGir,
  BeneficiarySocioProfessionalCategory
} from '@prisma/client'
import { BeneficiaryService } from '~/server/services/beneficiary'
import { BeneficiaryRepo } from '~/server/database'
import { getBeneficiaryPermissions } from '~/server/security'

vi.mock('~/server/database', () => {
  return {
    BeneficiaryRepo: {
      findUniqueOrThrow: vi.fn().mockResolvedValue({
        id: 'beneficiary-1',
        fileNumber: 'beneficiary-1',
        status: BeneficiaryStatus.Active,
        referents: [],
        structureId: 'structureId',
        additionalInformation: null,
        createdById: 'referent-1',
        created: new Date('2023-11-28'),
        updated: null,
        archivedById: null,
        archived: null,
        aidantConnectAuthorized: false,
        numeroPegase: 'numero-pegase-1',
        accommodationZone: BeneficiaryAccommodationZone.France,
        socialSecurityNumber: '123456789',
        ministereCategorie: BeneficiaryMinistereCategorie.CadreDroitPrive,
        ministereDepartementServiceAc:
          BeneficiaryMinistereDepartementServiceAc.AgentsEnInstanceDaffectation,
        ministereStructure:
          BeneficiaryMinistereStructure.AdministrationCentrale,
        protectionMeasure: BeneficiaryProtectionMeasure.CuratelleRenforcee,
        familySituation: BeneficiaryFamilySituation.CivilUnion,
        gir: BeneficiaryGir.Level1,
        socioProfessionalCategory:
          BeneficiarySocioProfessionalCategory.Disability,
        relatives: [
          {
            id: 'relative-1',
            hosted: true
          },
          { id: 'relative-2' },
          { id: 'relative-3' },
          {
            id: 'relative-4',
            hosted: true
          }
        ],
        _count: { followups: 2, helpRequests: 1 },
        followupTypes: [
          {
            typeId: 'type-1',
            name: 'Type 1'
          },
          {
            typeId: 'type-2',
            name: 'Type 2'
          }
        ]
      })
    }
  }
})

vi.mock('~/server/security', () => {
  return {
    getBeneficiaryPermissions: vi.fn()
  }
})

describe('BeneficiaryService.findBeneficiary', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('finds a beneficiary with all permissions', async () => {
    vi.mocked(getBeneficiaryPermissions).mockReturnValue({
      get: {
        accommodationZone: true,
        ministereCategorie: true,
        ministereDepartementServiceAc: true,
        ministereStructure: true,
        nir: true,
        numeroPegase: true
      },
      view: {
        externalOrganisations: true,
        health: true,
        occupationIncome: true,
        relatives: true
      }
    } as any)

    const beneficiary = await BeneficiaryService.findBeneficiary({
      user: {
        id: 'user-1',
        role: UserRole.StructureManager,
        status: UserStatus.Active,
        structureId: 'structure-1'
      },
      structure: { type: StructureType.Ccas },
      id: 'beneficiary-1'
    })

    expect(BeneficiaryRepo.findUniqueOrThrow).toHaveBeenCalledOnce()
    expect(beneficiary).toEqual({
      id: 'beneficiary-1',
      fileNumber: 'beneficiary-1',
      status: BeneficiaryStatus.Active,
      referents: [],
      structureId: 'structureId',
      additionalInformation: null,
      createdById: 'referent-1',
      created: new Date('2023-11-28'),
      updated: null,
      archivedById: null,
      archived: null,
      aidantConnectAuthorized: false,
      general: {
        accommodationAdditionalInformation: undefined,
        accommodationMode: undefined,
        accommodationName: undefined,
        numeroPegase: 'numero-pegase-1',
        accommodationZone: BeneficiaryAccommodationZone.France,
        additionalInformation: null,
        addressComplement: undefined,
        birthDate: undefined,
        birthName: undefined,
        birthPlace: undefined,
        city: undefined,
        deathDate: undefined,
        email: undefined,
        firstName: undefined,
        gender: undefined,
        mobility: undefined,
        nationality: undefined,
        noPhone: undefined,
        phone1: undefined,
        phone2: undefined,
        region: undefined,
        street: undefined,
        title: undefined,
        usualName: undefined,
        zipcode: undefined
      },
      externalOrganisations: {
        additionalInformation: null,
        involvedPartners: undefined,
        orientationStructure: undefined,
        orientationType: undefined,
        prescribingStructure: undefined,
        protectionMeasure: BeneficiaryProtectionMeasure.CuratelleRenforcee,
        representative: undefined,
        serviceProviders: undefined
      },
      health: {
        doctor: undefined,
        gir: 'Level1',
        healthAdditionalInformation: undefined,
        insurance: undefined,
        socialSecurityNumber: '123456789'
      },
      occupationIncome: {
        bank: undefined,
        cafNumber: undefined,
        employer: undefined,
        employerSiret: undefined,
        funeralContract: undefined,
        mainIncomeAmount: undefined,
        mainIncomeSource: undefined,
        majorChildrenMainIncomeAmount: undefined,
        majorChildrenMainIncomeSource: undefined,
        ministereCategorie: BeneficiaryMinistereCategorie.CadreDroitPrive,
        ministereDepartementServiceAc:
          BeneficiaryMinistereDepartementServiceAc.AgentsEnInstanceDaffectation,
        ministereStructure:
          BeneficiaryMinistereStructure.AdministrationCentrale,
        occupation: undefined,
        otherPensionOrganisations: undefined,
        partnerMainIncomeAmount: undefined,
        partnerMainIncomeSource: undefined,
        pensionOrganisations: undefined,
        socioProfessionalCategory:
          BeneficiarySocioProfessionalCategory.Disability,
        unemploymentNumber: undefined
      },
      taxHouseholds: {
        caregiver: undefined,
        familySituation: BeneficiaryFamilySituation.CivilUnion,
        majorChildren: undefined,
        minorChildren: undefined,
        taxHouseholds: [
          {
            id: 'relative-1',
            hosted: true
          },
          {
            id: 'relative-4',
            hosted: true
          }
        ]
      },
      entourages: [{ id: 'relative-2' }, { id: 'relative-3' }],
      history: {
        historyTotal: 3,
        types: [
          {
            id: 'type-1',
            name: 'Type 1'
          },
          {
            id: 'type-2',
            name: 'Type 2'
          }
        ]
      }
    })
  })

  it('finds a beneficiary without restricted properties', async () => {
    vi.mocked(getBeneficiaryPermissions).mockReturnValue({
      get: {
        accommodationZone: false,
        ministereCategorie: false,
        ministereDepartementServiceAc: false,
        ministereStructure: false,
        nir: false,
        numeroPegase: false
      },
      view: {
        externalOrganisations: true,
        health: true,
        occupationIncome: true,
        relatives: true
      }
    } as any)

    const beneficiary = await BeneficiaryService.findBeneficiary({
      user: {
        id: 'user-1',
        role: UserRole.StructureManager,
        status: UserStatus.Active,
        structureId: 'structure-1'
      },
      structure: { type: StructureType.Ccas },
      id: 'beneficiary-1'
    })

    expect(BeneficiaryRepo.findUniqueOrThrow).toHaveBeenCalledOnce()
    expect(beneficiary).toEqual({
      id: 'beneficiary-1',
      fileNumber: 'beneficiary-1',
      status: BeneficiaryStatus.Active,
      referents: [],
      structureId: 'structureId',
      additionalInformation: null,
      createdById: 'referent-1',
      created: new Date('2023-11-28'),
      updated: null,
      archivedById: null,
      archived: null,
      aidantConnectAuthorized: false,
      general: {
        accommodationAdditionalInformation: undefined,
        accommodationMode: undefined,
        accommodationName: undefined,
        numeroPegase: null,
        accommodationZone: null,
        additionalInformation: null,
        addressComplement: undefined,
        birthDate: undefined,
        birthName: undefined,
        birthPlace: undefined,
        city: undefined,
        deathDate: undefined,
        email: undefined,
        firstName: undefined,
        gender: undefined,
        mobility: undefined,
        nationality: undefined,
        noPhone: undefined,
        phone1: undefined,
        phone2: undefined,
        region: undefined,
        street: undefined,
        title: undefined,
        usualName: undefined,
        zipcode: undefined
      },
      externalOrganisations: {
        additionalInformation: null,
        involvedPartners: undefined,
        orientationStructure: undefined,
        orientationType: undefined,
        prescribingStructure: undefined,
        protectionMeasure: BeneficiaryProtectionMeasure.CuratelleRenforcee,
        representative: undefined,
        serviceProviders: undefined
      },
      health: {
        doctor: undefined,
        gir: 'Level1',
        healthAdditionalInformation: undefined,
        insurance: undefined,
        socialSecurityNumber: null
      },
      occupationIncome: {
        bank: undefined,
        cafNumber: undefined,
        employer: undefined,
        employerSiret: undefined,
        funeralContract: undefined,
        mainIncomeAmount: undefined,
        mainIncomeSource: undefined,
        majorChildrenMainIncomeAmount: undefined,
        majorChildrenMainIncomeSource: undefined,
        ministereCategorie: null,
        ministereDepartementServiceAc: null,
        ministereStructure: null,
        occupation: undefined,
        otherPensionOrganisations: undefined,
        partnerMainIncomeAmount: undefined,
        partnerMainIncomeSource: undefined,
        pensionOrganisations: undefined,
        socioProfessionalCategory:
          BeneficiarySocioProfessionalCategory.Disability,
        unemploymentNumber: undefined
      },
      taxHouseholds: {
        caregiver: undefined,
        familySituation: BeneficiaryFamilySituation.CivilUnion,
        majorChildren: undefined,
        minorChildren: undefined,
        taxHouseholds: [
          {
            id: 'relative-1',
            hosted: true
          },
          {
            id: 'relative-4',
            hosted: true
          }
        ]
      },
      entourages: [{ id: 'relative-2' }, { id: 'relative-3' }],
      history: {
        historyTotal: 3,
        types: [
          {
            id: 'type-1',
            name: 'Type 1'
          },
          {
            id: 'type-2',
            name: 'Type 2'
          }
        ]
      }
    })
  })

  it('finds a beneficiary without restricted sections', async () => {
    vi.mocked(getBeneficiaryPermissions).mockReturnValue({
      get: {
        accommodationZone: true,
        ministereCategorie: true,
        ministereDepartementServiceAc: true,
        ministereStructure: true,
        nir: true,
        numeroPegase: true
      },
      view: {
        externalOrganisations: false,
        health: false,
        occupationIncome: false,
        relatives: false
      }
    } as any)

    const beneficiary = await BeneficiaryService.findBeneficiary({
      user: {
        id: 'user-1',
        role: UserRole.StructureManager,
        status: UserStatus.Active,
        structureId: 'structure-1'
      },
      structure: { type: StructureType.Ccas },
      id: 'beneficiary-1'
    })

    expect(BeneficiaryRepo.findUniqueOrThrow).toHaveBeenCalledOnce()
    expect(beneficiary).toEqual({
      id: 'beneficiary-1',
      fileNumber: 'beneficiary-1',
      status: BeneficiaryStatus.Active,
      referents: [],
      structureId: 'structureId',
      additionalInformation: null,
      createdById: 'referent-1',
      created: new Date('2023-11-28'),
      updated: null,
      archivedById: null,
      archived: null,
      aidantConnectAuthorized: false,
      general: {
        accommodationAdditionalInformation: undefined,
        accommodationMode: undefined,
        accommodationName: undefined,
        numeroPegase: 'numero-pegase-1',
        accommodationZone: BeneficiaryAccommodationZone.France,
        additionalInformation: null,
        addressComplement: undefined,
        birthDate: undefined,
        birthName: undefined,
        birthPlace: undefined,
        city: undefined,
        deathDate: undefined,
        email: undefined,
        firstName: undefined,
        gender: undefined,
        mobility: undefined,
        nationality: undefined,
        noPhone: undefined,
        phone1: undefined,
        phone2: undefined,
        region: undefined,
        street: undefined,
        title: undefined,
        usualName: undefined,
        zipcode: undefined
      },
      externalOrganisations: undefined,
      health: undefined,
      occupationIncome: undefined,
      taxHouseholds: undefined,
      entourages: undefined,
      history: {
        historyTotal: 3,
        types: [
          {
            id: 'type-1',
            name: 'Type 1'
          },
          {
            id: 'type-2',
            name: 'Type 2'
          }
        ]
      }
    })
  })
})
