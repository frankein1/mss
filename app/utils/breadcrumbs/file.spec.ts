import { describe, test, expect } from 'vitest'
import { breadcrumbs } from './file'
import type { BeneficiaryNames } from '~~/types/beneficiary'

const familyIdentification: BeneficiaryNames[] = [
  { firstName: 'Marie', usualName: 'Dupont', birthName: 'Martin' }
]

describe('file breadcrumbs', () => {
  test('AppFile with default origin includes beneficiaries', () => {
    expect(breadcrumbs.AppFile('file-1', familyIdentification)).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: 'Marie DUPONT', to: '/app/files/file-1' }
    ])
  })

  test('AppFile with AppOverview origin skips beneficiaries', () => {
    expect(
      breadcrumbs.AppFile('file-1', familyIdentification, {
        originPage: 'AppOverview'
      })
    ).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Marie DUPONT', to: '/app/files/file-1' }
    ])
  })

  test('AppFile with AppHistory origin includes history', () => {
    expect(
      breadcrumbs.AppFile('file-1', familyIdentification, {
        originPage: 'AppHistory'
      })
    ).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Accompagnements', to: '/app/history' },
      { text: 'Marie DUPONT', to: '/app/files/file-1' }
    ])
  })

  test('AppFile with null familyIdentification shows empty text', () => {
    expect(breadcrumbs.AppFile('file-1', null)).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: '', to: '/app/files/file-1' }
    ])
  })

  test('AppFile truncates long family name to 5 words with shortParagraph', () => {
    const longFamilyIdentification: BeneficiaryNames[] = [
      { firstName: 'Marie', usualName: 'Dupont' },
      { firstName: 'Jean', usualName: 'Martin' },
      { firstName: 'Pierre', usualName: 'Durand' }
    ]
    expect(breadcrumbs.AppFile('file-1', longFamilyIdentification)).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      {
        text: 'Marie DUPONT & Jean MARTIN...',
        to: '/app/files/file-1'
      }
    ])
  })

  test('AppFileAdd returns overview + add', () => {
    expect(breadcrumbs.AppFileAdd()).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Créer un dossier', to: '/app/files/add' }
    ])
  })

  test('AppHistory returns overview + history', () => {
    expect(breadcrumbs.AppHistory()).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Accompagnements', to: '/app/history' }
    ])
  })
})
