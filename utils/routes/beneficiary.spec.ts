import { describe, test, expect } from 'vitest'
import { routes } from './beneficiary'
import { BeneficiaryTab } from '~/utils/constants/beneficiary'
import { FilterBeneficiaryNotFilled } from '../constants/filters'

describe('beneficiary routes', () => {
  describe('AppBeneficiaries', () => {
    test('path returns /app/beneficiaries without options', () => {
      expect(routes.AppBeneficiaries.path()).toBe('/app/beneficiaries')
    })

    test('path returns /app/beneficiaries with notFilled filter', () => {
      expect(
        routes.AppBeneficiaries.path({
          notFilled: FilterBeneficiaryNotFilled.AgeGroup
        })
      ).toBe('/app/beneficiaries?not-filled=birthDate')
    })
  })

  describe('AppBeneficiariesAdd', () => {
    test('path returns /app/files/add', () => {
      expect(routes.AppBeneficiariesAdd.path()).toBe('/app/files/add')
    })
  })

  describe('AppBeneficiariesArchive', () => {
    test('path returns /app/beneficiaries/:id/archive', () => {
      expect(routes.AppBeneficiariesArchive.path('ben-1')).toBe(
        '/app/beneficiaries/ben-1/archive'
      )
    })
  })

  describe('AppBeneficiariesReferentTransfer', () => {
    test('path returns /app/beneficiaries/referent-transfer', () => {
      expect(routes.AppBeneficiariesReferentTransfer.path()).toBe(
        '/app/beneficiaries/referent-transfer'
      )
    })
  })

  describe('AppBeneficiary', () => {
    test('path returns /app/beneficiaries/:id', () => {
      expect(routes.AppBeneficiary.path('ben-1')).toBe(
        '/app/beneficiaries/ben-1'
      )
    })

    test('path returns empty string when beneficiaryId is undefined', () => {
      expect(routes.AppBeneficiary.path(undefined)).toBe('')
    })

    test('path returns path with tab hash', () => {
      expect(
        routes.AppBeneficiary.path('ben-1', { tab: BeneficiaryTab.Details })
      ).toBe('/app/beneficiaries/ben-1#Details')
    })

    test('title returns formatted name when beneficiary is provided', () => {
      expect(
        routes.AppBeneficiary.title({
          firstName: 'Marie',
          usualName: 'Dupont',
          birthName: null
        })
      ).toBe('Marie DUPONT')
    })

    test('title returns empty string when beneficiary is null', () => {
      expect(routes.AppBeneficiary.title(null)).toBe('')
    })
  })

  describe('AppBeneficiaryPrint', () => {
    test('path returns /app/beneficiaries/:id/print', () => {
      expect(routes.AppBeneficiaryPrint.path('ben-1')).toBe(
        '/app/beneficiaries/ben-1/print'
      )
    })
  })

  describe('AppBeneficiaryEditInfo', () => {
    test('path returns /app/beneficiaries/:id/edit/info without options', () => {
      expect(routes.AppBeneficiaryEditInfo.path('ben-1')).toBe(
        '/app/beneficiaries/ben-1/edit/info'
      )
    })

    test('path returns path with saved param', () => {
      expect(routes.AppBeneficiaryEditInfo.path('ben-1', { saved: true })).toBe(
        '/app/beneficiaries/ben-1/edit/info?saved=true'
      )
    })

    test('path returns path with originTab param', () => {
      expect(
        routes.AppBeneficiaryEditInfo.path('ben-1', {
          originTab: BeneficiaryTab.Details
        })
      ).toBe('/app/beneficiaries/ben-1/edit/info?originTab=Details')
    })
  })

  describe('AppBeneficiaryArchive', () => {
    test('path returns /app/beneficiaries/:id/archive', () => {
      expect(routes.AppBeneficiaryArchive.path('ben-1')).toBe(
        '/app/beneficiaries/ben-1/archive'
      )
    })
  })
})
