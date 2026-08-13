import { describe, test, expect } from 'vitest'
import { breadcrumbs } from './structure'

describe('structure breadcrumbs', () => {
  test('AppPartners returns overview + partners', () => {
    expect(breadcrumbs.AppPartners()).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Annuaire des partenaires', to: '/app/partners' }
    ])
  })

  test('AppStructure returns overview + structure', () => {
    expect(breadcrumbs.AppStructure()).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Configurer votre structure', to: '/app/structure' }
    ])
  })

  test('AppStructureEdit returns overview + structure edit', () => {
    expect(breadcrumbs.AppStructureEdit()).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      {
        text: 'Modifier les informations de votre structure',
        to: '/app/structure/edit'
      }
    ])
  })

  test('AppStructureSocialSupportSubjectsEdit returns overview + subjects edit', () => {
    expect(breadcrumbs.AppStructureSocialSupportSubjectsEdit()).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      {
        text: 'Ajouter un accompagnement',
        to: '/app/structure/custom-objects/social-support-subjects/edit'
      }
    ])
  })

  test('AppStructureUserEdit returns overview + structure + user edit', () => {
    expect(breadcrumbs.AppStructureUserEdit('Jean Dupont')).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Configurer votre structure', to: '/app/structure' },
      {
        text: 'Modifier le compte de Jean Dupont',
        to: '/app/structure/users/Jean Dupont/edit'
      }
    ])
  })

  test('AppStructureUserDelete returns overview + structure + user edit bread', () => {
    expect(breadcrumbs.AppStructureUserDelete('Jean Dupont')).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Configurer votre structure', to: '/app/structure' },
      {
        text: 'Modifier le compte de Jean Dupont',
        to: '/app/structure/users/Jean Dupont/edit'
      }
    ])
  })

  test('AppStructureUserAdd returns overview + structure + user add', () => {
    expect(breadcrumbs.AppStructureUserAdd()).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Configurer votre structure', to: '/app/structure' },
      {
        text: 'Ajouter un nouvel utilisateur',
        to: '/app/structure/users/add'
      }
    ])
  })
})
