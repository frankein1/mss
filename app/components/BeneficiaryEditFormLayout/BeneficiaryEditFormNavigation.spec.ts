// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { FamilyFilePermissions } from '~~/server/security'
import { createFakeFamilyFilePermissions } from '~~/test/components/beneficiary/helpers'
import BeneficiaryEditFormNavigation from './BeneficiaryEditFormNavigation.vue'

const BENEFICIARY_ID = '00000000-0000-0000-0000-000000000001'

function mountNavigation(
  permissionsOverride?: Parameters<typeof createFakeFamilyFilePermissions>[0]
) {
  return mountSuspended(BeneficiaryEditFormNavigation, {
    props: {
      currentRoute: 'AppBeneficiaryEditInfo',
      beneficiaryId: BENEFICIARY_ID,
      permissions: createFakeFamilyFilePermissions(permissionsOverride),
      originTab: undefined,
      beneficiaryFormLayoutMainContainer: null
    }
  })
}

function mountNavigationUndefinedPermissions() {
  return mountSuspended(BeneficiaryEditFormNavigation, {
    props: {
      currentRoute: 'AppBeneficiaryEditInfo',
      beneficiaryId: BENEFICIARY_ID,
      permissions: undefined as unknown as FamilyFilePermissions,
      originTab: undefined,
      beneficiaryFormLayoutMainContainer: null
    }
  })
}

describe('BeneficiaryEditFormNavigation - edit.general', () => {
  it('hides Informations bénéficiaire and Situation familiale tabs when edit.general is false', async () => {
    const wrapper = await mountNavigation({ edit: { general: false } })
    expect(wrapper.text()).not.toContain('Informations bénéficiaire')
    expect(wrapper.text()).not.toContain('Situation familiale')
  })

  it('shows Informations bénéficiaire and Situation familiale tabs when edit.general is true', async () => {
    const wrapper = await mountNavigation({ edit: { general: true } })
    expect(wrapper.text()).toContain('Informations bénéficiaire')
    expect(wrapper.text()).toContain('Situation familiale')
  })

  it('shows no tabs when permissions is undefined (loading state)', async () => {
    const wrapper = await mountNavigationUndefinedPermissions()
    expect(wrapper.text()).not.toContain('Informations bénéficiaire')
    expect(wrapper.text()).not.toContain('Situation familiale')
    expect(wrapper.text()).not.toContain('Entourage')
    expect(wrapper.text()).not.toContain('Santé')
    expect(wrapper.text()).not.toContain('Activité')
    expect(wrapper.text()).not.toContain('Partenaires')
  })
})

describe('BeneficiaryEditFormNavigation - edit.relatives', () => {
  it('hides Entourage tab when edit.relatives is false', async () => {
    const wrapper = await mountNavigation({ edit: { relatives: false } })
    expect(wrapper.text()).not.toContain('Entourage')
  })

  it('shows Entourage tab when edit.relatives is true', async () => {
    const wrapper = await mountNavigation({ edit: { relatives: true } })
    expect(wrapper.text()).toContain('Entourage')
  })
})

describe('BeneficiaryEditFormNavigation - edit.health', () => {
  it('hides Santé tab when edit.health is false', async () => {
    const wrapper = await mountNavigation({ edit: { health: false } })
    expect(wrapper.text()).not.toContain('Santé')
  })

  it('shows Santé tab when edit.health is true', async () => {
    const wrapper = await mountNavigation({ edit: { health: true } })
    expect(wrapper.text()).toContain('Santé')
  })
})

describe('BeneficiaryEditFormNavigation - edit.occupationIncome', () => {
  it('hides Activité tab when edit.occupationIncome is false', async () => {
    const wrapper = await mountNavigation({ edit: { occupationIncome: false } })
    expect(wrapper.text()).not.toContain('Activité')
  })

  it('shows Activité tab when edit.occupationIncome is true', async () => {
    const wrapper = await mountNavigation({ edit: { occupationIncome: true } })
    expect(wrapper.text()).toContain('Activité')
  })
})

describe('BeneficiaryEditFormNavigation - edit.externalOrganisations', () => {
  it('hides Partenaires tab when edit.externalOrganisations is false', async () => {
    const wrapper = await mountNavigation({
      edit: { externalOrganisations: false }
    })
    expect(wrapper.text()).not.toContain('Partenaires')
  })

  it('shows Partenaires tab when edit.externalOrganisations is true', async () => {
    const wrapper = await mountNavigation({
      edit: { externalOrganisations: true }
    })
    expect(wrapper.text()).toContain('Partenaires')
  })
})
