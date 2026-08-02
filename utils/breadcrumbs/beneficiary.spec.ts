import { describe, test, expect } from 'vitest'
import { breadcrumbs } from './beneficiary'
import type { BeneficiaryIdentification } from '~/types/beneficiary'

const beneficiary: BeneficiaryIdentification = {
  id: 'ben-1',
  firstName: 'Marie',
  usualName: 'Dupont',
  birthName: 'Martin',
  birthDate: new Date('1990-01-01')
}

describe('beneficiary breadcrumbs', () => {
  test('AppBeneficiaries returns overview + beneficiaries', () => {
    expect(breadcrumbs.AppBeneficiaries()).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' }
    ])
  })

  test('AppBeneficiariesReferentTransfer returns overview + beneficiaries + referent transfer', () => {
    expect(breadcrumbs.AppBeneficiariesReferentTransfer()).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      {
        text: 'Modifier les agents référents',
        to: '/app/beneficiaries/referent-transfer'
      }
    ])
  })

  test('AppBeneficiariesAdd returns overview + add', () => {
    expect(breadcrumbs.AppBeneficiariesAdd()).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Créer un dossier', to: '/app/files/add' }
    ])
  })

  test('AppBeneficiary with null beneficiary defaults to beneficiaries origin', () => {
    expect(breadcrumbs.AppBeneficiary(null)).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: '', to: '' }
    ])
  })

  test('AppBeneficiary with beneficiary and default origin includes beneficiaries', () => {
    expect(breadcrumbs.AppBeneficiary(beneficiary)).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: 'Marie DUPONT', to: '/app/beneficiaries/ben-1' }
    ])
  })

  test('AppBeneficiary with AppOverview origin skips beneficiaries', () => {
    expect(breadcrumbs.AppBeneficiary(beneficiary, 'AppOverview')).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Marie DUPONT', to: '/app/beneficiaries/ben-1' }
    ])
  })

  test('AppBeneficiary with AppHistory origin skips beneficiaries', () => {
    expect(breadcrumbs.AppBeneficiary(beneficiary, 'AppHistory')).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Marie DUPONT', to: '/app/beneficiaries/ben-1' }
    ])
  })

  test('AppBeneficiaryEdit with beneficiary', () => {
    expect(breadcrumbs.AppBeneficiaryEdit(beneficiary)).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Marie DUPONT', to: '/app/beneficiaries/ben-1' },
      { text: 'Modifier Marie DUPONT', to: 'ben-1' }
    ])
  })

  test('AppBeneficiaryEdit with null beneficiary', () => {
    expect(breadcrumbs.AppBeneficiaryEdit(null)).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: '', to: '' },
      { text: '', to: '' }
    ])
  })

  test('AppBeneficiaryPrint with beneficiary', () => {
    expect(breadcrumbs.AppBeneficiaryPrint(beneficiary)).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Marie DUPONT', to: '/app/beneficiaries/ben-1' },
      {
        text: 'Imprimer la fiche de Marie DUPONT',
        to: '/app/beneficiaries/ben-1/print'
      }
    ])
  })
})
