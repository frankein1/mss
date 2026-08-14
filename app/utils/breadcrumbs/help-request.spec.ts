import { describe, test, expect } from 'vitest'
import { breadcrumbs } from './help-request'
import { FileInstructionType } from '@prisma/client'
import type {
  BeneficiaryIdentification,
  BeneficiaryNames
} from '~~/types/beneficiary'

const beneficiary: BeneficiaryIdentification = {
  id: 'ben-1',
  firstName: 'Marie',
  usualName: 'Dupont',
  birthName: 'Martin',
  birthDate: new Date('1990-01-01')
}

const familyIdentification: BeneficiaryNames[] = [
  { firstName: 'Marie', usualName: 'Dupont', birthName: 'Martin' }
]

describe('help-request breadcrumbs', () => {
  test('AppBeneficiaryHelpRequestAdd with beneficiary', () => {
    expect(
      breadcrumbs.AppBeneficiaryHelpRequestAdd(
        beneficiary,
        FileInstructionType.Financial
      )
    ).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: 'Marie DUPONT', to: '/app/beneficiaries/ben-1' },
      {
        text: "Instruction d'un dossier  pour Marie DUPONT",
        to: '/app/files/ben-1/help-requests/financial/add'
      }
    ])
  })

  test('AppBeneficiaryHelpRequestAdd with null beneficiary', () => {
    expect(
      breadcrumbs.AppBeneficiaryHelpRequestAdd(
        null,
        FileInstructionType.Financial
      )
    ).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: '', to: '' },
      {
        text: "Instruction d'un dossier",
        to: '/app/files//help-requests/financial/add'
      }
    ])
  })

  test('AppBeneficiaryHelpRequestEdit with helpRequest', () => {
    const helpRequest = {
      id: 'hr-1',
      familyFileId: 'fam-1',
      beneficiary
    }
    expect(
      breadcrumbs.AppBeneficiaryHelpRequestEdit(
        helpRequest,
        FileInstructionType.Financial
      )
    ).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: 'Marie DUPONT', to: '/app/beneficiaries/ben-1' },
      {
        text: "Modifier l'instruction de dossier d'une personne bénéficiaire",
        to: '/app/files/fam-1/help-requests/financial/hr-1/edit'
      }
    ])
  })

  test('AppBeneficiaryHelpRequestEdit with null helpRequest', () => {
    expect(
      breadcrumbs.AppBeneficiaryHelpRequestEdit(
        null,
        FileInstructionType.Financial
      )
    ).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: '', to: '' },
      {
        text: "Modifier l'instruction de dossier d'une personne bénéficiaire",
        to: '/app/files//help-requests/financial//edit'
      }
    ])
  })

  test('AppFileHelpRequestAdd with familyFileId', () => {
    expect(
      breadcrumbs.AppFileHelpRequestAdd(
        'file-1',
        familyIdentification,
        FileInstructionType.Financial
      )
    ).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: 'Marie DUPONT', to: '/app/files/file-1' },
      {
        text: "Instruction d'un dossier",
        to: '/app/files/file-1/help-requests/financial/add'
      }
    ])
  })

  test('AppFileHelpRequestEdit with helpRequest', () => {
    const helpRequest = {
      id: 'hr-1',
      familyFileId: 'fam-1',
      beneficiary
    }
    expect(
      breadcrumbs.AppFileHelpRequestEdit(
        helpRequest,
        familyIdentification,
        FileInstructionType.Financial
      )
    ).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: 'Marie DUPONT', to: '/app/files/fam-1' },
      {
        text: "Modifier l'instruction de dossier d'une personne bénéficiaire",
        to: '/app/files/fam-1/help-requests/financial/hr-1/edit'
      }
    ])
  })
})
