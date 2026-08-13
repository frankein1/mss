import { describe, test, expect } from 'vitest'
import { breadcrumbs } from './followup'
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

describe('followup breadcrumbs', () => {
  test('AppBeneficiaryFollowupAdd with beneficiary', () => {
    expect(breadcrumbs.AppBeneficiaryFollowupAdd(beneficiary)).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: 'Marie DUPONT', to: '/app/beneficiaries/ben-1' },
      {
        text: 'Entretien avec Marie DUPONT',
        to: '/app/files/ben-1/followups/add'
      }
    ])
  })

  test('AppBeneficiaryFollowupAdd with null beneficiary', () => {
    expect(breadcrumbs.AppBeneficiaryFollowupAdd(null)).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: '', to: '' },
      {
        text: 'Entretien avec une personne bénéficiaire',
        to: '/app/files//followups/add'
      }
    ])
  })

  test('AppBeneficiaryFollowupEdit with followup', () => {
    const followup = {
      id: 'fu-1',
      familyFileId: 'fam-1',
      beneficiary
    }
    expect(breadcrumbs.AppBeneficiaryFollowupEdit(followup)).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: 'Marie DUPONT', to: '/app/beneficiaries/ben-1' },
      {
        text: "Modifier l'entretien avec une personne bénéficiaire",
        to: '/app/files/fam-1/followups/fu-1/edit'
      }
    ])
  })

  test('AppBeneficiaryFollowupEdit with null followup', () => {
    expect(breadcrumbs.AppBeneficiaryFollowupEdit(null)).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: '', to: '' },
      {
        text: "Modifier l'entretien avec une personne bénéficiaire",
        to: '/app/files//followups//edit'
      }
    ])
  })

  test('AppFileFollowupAdd with familyFileId and identification', () => {
    expect(
      breadcrumbs.AppFileFollowupAdd('file-1', familyIdentification)
    ).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: 'Marie DUPONT', to: '/app/files/file-1' },
      {
        text: 'Entretien avec une personne bénéficiaire',
        to: '/app/files/file-1/followups/add'
      }
    ])
  })

  test('AppFileFollowupEdit with followup and identification', () => {
    const followup = {
      id: 'fu-1',
      familyFileId: 'fam-1',
      beneficiary
    }
    expect(
      breadcrumbs.AppFileFollowupEdit(followup, familyIdentification)
    ).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: 'Marie DUPONT', to: '/app/files/fam-1' },
      {
        text: "Modifier l'entretien avec une personne bénéficiaire",
        to: '/app/files/fam-1/followups/fu-1/edit'
      }
    ])
  })
})
