import { describe, test, expect } from 'vitest'
import { routes } from './followup'

describe('followup routes', () => {
  describe('AppBeneficiaryFollowupAdd', () => {
    test('path returns /app/files/:id/followups/add without options', () => {
      expect(routes.AppBeneficiaryFollowupAdd.path('file-1')).toBe(
        '/app/files/file-1/followups/add'
      )
    })

    test('path returns path with beneficiaryId option', () => {
      expect(
        routes.AppBeneficiaryFollowupAdd.path('file-1', {
          beneficiaryId: 'ben-1'
        })
      ).toBe('/app/files/file-1/followups/add?beneficiaryId=ben-1')
    })

    test('title returns formatted name when beneficiary is provided', () => {
      expect(
        routes.AppBeneficiaryFollowupAdd.title({
          firstName: 'Marie',
          usualName: 'Dupont'
        })
      ).toBe('Entretien avec Marie DUPONT')
    })

    test('title returns default text when beneficiary is null', () => {
      expect(routes.AppBeneficiaryFollowupAdd.title(null)).toBe(
        'Entretien avec une personne bénéficiaire'
      )
    })
  })

  describe('AppBeneficiaryFollowupEdit', () => {
    test('path returns /app/files/:fileId/followups/:followupId/edit', () => {
      expect(
        routes.AppBeneficiaryFollowupEdit.path('file-1', 'followup-1')
      ).toBe('/app/files/file-1/followups/followup-1/edit')
    })

    test('title returns formatted name when beneficiary is provided', () => {
      expect(
        routes.AppBeneficiaryFollowupEdit.title({
          firstName: 'Marie',
          usualName: 'Dupont'
        })
      ).toBe("Modifier l'entretien avec Marie DUPONT")
    })

    test('title returns default text when beneficiary is null', () => {
      expect(routes.AppBeneficiaryFollowupEdit.title(null)).toBe(
        "Modifier l'entretien avec une personne bénéficiaire"
      )
    })
  })
})
