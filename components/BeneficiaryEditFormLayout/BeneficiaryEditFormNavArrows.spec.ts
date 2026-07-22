// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { AppBeneficiaryEditRoute } from '~/utils/routes'
import { createFakeFamilyFilePermissions } from '~/test/components/beneficiary/helpers'
import BeneficiaryEditFormNavArrows from './BeneficiaryEditFormNavArrows.vue'

const BENEFICIARY_ID = '00000000-0000-0000-0000-000000000001'

function mountNavArrows(
  currentRoute: AppBeneficiaryEditRoute,
  permissionsOverride?: Parameters<typeof createFakeFamilyFilePermissions>[0]
) {
  return mountSuspended(BeneficiaryEditFormNavArrows, {
    props: {
      currentRoute,
      beneficiaryId: BENEFICIARY_ID,
      permissions: createFakeFamilyFilePermissions(permissionsOverride),
      originTab: undefined
    }
  })
}

describe('BeneficiaryEditFormNavArrows - boundaries', () => {
  it('shows no previous arrow on Informations tab (first tab)', async () => {
    const wrapper = await mountNavArrows('AppBeneficiaryEditInfo')
    expect(wrapper.find('button.fr-icon-arrow-left-line').exists()).toBe(false)
  })

  it('shows a next arrow on "Structures externes" tab (no longer the last tab)', async () => {
    const wrapper = await mountNavArrows(
      'AppBeneficiaryEditExternalOrganisations'
    )
    expect(wrapper.find('button.fr-icon-arrow-right-line').exists()).toBe(true)
    expect(wrapper.find('button.fr-icon-arrow-right-line').text()).toContain(
      'Parcours et dispositifs'
    )
  })

  it('shows no next arrow on "Parcours et dispositifs" tab (last tab)', async () => {
    const wrapper = await mountNavArrows('AppBeneficiaryEditSupportPrograms')
    expect(wrapper.find('button.fr-icon-arrow-right-line').exists()).toBe(false)
  })
})

describe('BeneficiaryEditFormNavArrows - skip logic', () => {
  it('skips Entourage and shows Santé as next when edit.relatives is false', async () => {
    const wrapper = await mountNavArrows('AppBeneficiaryEditTaxHousehold', {
      edit: { relatives: false }
    })
    expect(wrapper.find('button.fr-icon-arrow-right-line').text()).toContain(
      'Santé'
    )
  })

  it('skips Entourage and Santé and shows Activité as next when both are false', async () => {
    const wrapper = await mountNavArrows('AppBeneficiaryEditTaxHousehold', {
      edit: { relatives: false, health: false }
    })
    expect(wrapper.find('button.fr-icon-arrow-right-line').text()).toContain(
      'Activité'
    )
  })
})
