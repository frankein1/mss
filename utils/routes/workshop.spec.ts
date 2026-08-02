import { describe, test, expect } from 'vitest'
import { routes } from './workshop'
import { WorkshopTab } from '~/utils/constants/workshop'
import type { WorkshopDetails } from '~/types/workshop'

describe('workshop routes', () => {
  describe('AppWorkshopAdd', () => {
    test('path returns /app/workshops/add', () => {
      expect(routes.AppWorkshopAdd.path()).toBe('/app/workshops/add')
    })
  })

  describe('AppWorkshop', () => {
    test('path returns /app/workshops/:id', () => {
      expect(routes.AppWorkshop.path('w-1')).toBe('/app/workshops/w-1')
    })

    test('title returns workshop name when workshop is provided', () => {
      const workshop = {
        id: 'w-1',
        workshopName: { name: 'Test' }
      } as unknown as WorkshopDetails
      expect(routes.AppWorkshop.title(workshop)).toBe('Test')
    })

    test('title returns default text when workshop is null', () => {
      expect(routes.AppWorkshop.title(null)).toBe('Atelier')
    })
  })

  describe('AppWorkshopEdit', () => {
    test('path returns /app/workshops/:id/edit', () => {
      expect(routes.AppWorkshopEdit.path('w-1')).toBe('/app/workshops/w-1/edit')
    })

    test('title returns formatted name when workshop is provided', () => {
      const workshop = {
        id: 'w-1',
        workshopName: { name: 'Test' }
      } as unknown as WorkshopDetails
      expect(routes.AppWorkshopEdit.title(workshop)).toBe(
        "Modifier l'atelier Test"
      )
    })

    test('title returns default text when workshop is null', () => {
      expect(routes.AppWorkshopEdit.title(null)).toBe('Modifier un atelier')
    })
  })

  describe('AppWorkshopDuplicate', () => {
    test('path returns /app/workshops/:id/duplicate', () => {
      expect(routes.AppWorkshopDuplicate.path('w-1')).toBe(
        '/app/workshops/w-1/duplicate'
      )
    })

    test('title returns formatted name when workshop is provided', () => {
      const workshop = {
        id: 'w-1',
        workshopName: { name: 'Test' }
      } as unknown as WorkshopDetails
      expect(routes.AppWorkshopDuplicate.title(workshop)).toBe(
        "Dupliquer l'atelier Test"
      )
    })

    test('title returns default text when workshop is null', () => {
      expect(routes.AppWorkshopDuplicate.title(null)).toBe(
        'Dupliquer un atelier'
      )
    })
  })

  describe('AppWorkshops', () => {
    test('path returns /app/workshops without options', () => {
      expect(routes.AppWorkshops.path()).toBe('/app/workshops')
    })

    test('path returns /app/workshops with tab hash', () => {
      expect(
        routes.AppWorkshops.path({ tab: WorkshopTab.UpcomingWorkshops })
      ).toBe('/app/workshops#UpcomingWorkshops')
    })
  })
})
