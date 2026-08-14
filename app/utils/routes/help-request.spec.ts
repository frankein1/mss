import { describe, test, expect } from 'vitest'
import { routes } from './help-request'

describe('help-request routes', () => {
  describe('AppBeneficiaryHelpRequestAdd', () => {
    test('path returns add route without options', () => {
      expect(routes.AppBeneficiaryHelpRequestAdd.path('f-1', 'Financial')).toBe(
        '/app/files/f-1/help-requests/financial/add'
      )
    })

    test('path returns add route with beneficiaryId option', () => {
      expect(
        routes.AppBeneficiaryHelpRequestAdd.path('f-1', 'Financial', {
          beneficiaryId: 'ben-1'
        })
      ).toBe('/app/files/f-1/help-requests/financial/add?beneficiaryId=ben-1')
    })

    test('path lowercases the subject', () => {
      expect(routes.AppBeneficiaryHelpRequestAdd.path('f-1', 'Housing')).toBe(
        '/app/files/f-1/help-requests/housing/add'
      )
    })
  })

  describe('AppBeneficiaryHelpRequestEdit', () => {
    test('path returns edit route', () => {
      expect(
        routes.AppBeneficiaryHelpRequestEdit.path('f-1', 'hr-1', 'Housing')
      ).toBe('/app/files/f-1/help-requests/housing/hr-1/edit')
    })

    test('path lowercases the subject for Other type', () => {
      expect(
        routes.AppBeneficiaryHelpRequestEdit.path('f-1', 'hr-1', 'Other')
      ).toBe('/app/files/f-1/help-requests/other/hr-1/edit')
    })
  })
})
