import { describe, test, expect } from 'vitest'
import { breadcrumbs } from './workshop'
import type { WorkshopDetails } from '~~/types/workshop'

const workshop = {
  id: 'w-1',
  workshopName: { name: 'Atelier couture' }
} as unknown as WorkshopDetails

describe('workshop breadcrumbs', () => {
  test('AppWorkshops returns overview + workshops', () => {
    expect(breadcrumbs.AppWorkshops()).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Ateliers collectifs, animations...', to: '/app/workshops' }
    ])
  })

  test('AppWorkshop returns overview + workshops + workshop name', () => {
    expect(breadcrumbs.AppWorkshop(workshop)).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Ateliers collectifs, animations...', to: '/app/workshops' },
      { text: 'Atelier couture', to: '/app/workshops/w-1' }
    ])
  })

  test('AppWorkshopAdd returns overview + workshops + add', () => {
    expect(breadcrumbs.AppWorkshopAdd()).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Ateliers collectifs, animations...', to: '/app/workshops' },
      { text: 'Créer un atelier', to: '/app/workshops/add' }
    ])
  })

  test('AppWorkshopEdit returns overview + workshops + workshop name', () => {
    expect(breadcrumbs.AppWorkshopEdit(workshop)).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Ateliers collectifs, animations...', to: '/app/workshops' },
      { text: 'Atelier couture', to: '/app/workshops/w-1' }
    ])
  })

  test('AppWorkshopDuplicate returns overview + workshops + duplicate', () => {
    expect(breadcrumbs.AppWorkshopDuplicate(workshop)).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Ateliers collectifs, animations...', to: '/app/workshops' },
      { text: 'Dupliquer un atelier', to: '/app/workshops/w-1' }
    ])
  })
})
