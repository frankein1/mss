// @vitest-environment nuxt
import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setPermissions, withForm } from '~/test/components/helpers'
import {
  createFakeTrpcClientBeneficiary,
  createFakeFamilyFilePermissions
} from '~/test/components/beneficiary/helpers'
import { updateBeneficiaryGeneralInformationSchema } from '~/server/schema'
import BeneficiaryFormGeneralInformation from './BeneficiaryFormGeneralInformation.vue'

const fakeTrpcClient = createFakeTrpcClientBeneficiary()
mockNuxtImport('useTrpcClient', () => () => fakeTrpcClient)

function mountGeneralInfo(
  permissionsOverride?: Parameters<typeof createFakeFamilyFilePermissions>[0]
) {
  return mountSuspended(
    withForm(
      BeneficiaryFormGeneralInformation,
      updateBeneficiaryGeneralInformationSchema,
      {
        agents: [],
        beneficiaryReferentIds: [],
        initialBeneficiary: null,
        initialBeneficiaryStatus: undefined,
        permissions: createFakeFamilyFilePermissions(permissionsOverride)
      }
    )
  )
}

describe('BeneficiaryFormGeneralInformation - module.ministere', () => {
  beforeEach(() => {
    setPermissions({})
  })

  it('hides numeroPegase and accommodationZone when module.ministere is false', async () => {
    const wrapper = await mountGeneralInfo()
    expect(wrapper.find('[name="numeroPegase"]').exists()).toBe(false)
    expect(wrapper.find('[name="accommodationZone"]').exists()).toBe(false)
  })

  it('shows numeroPegase and accommodationZone when module.ministere is true', async () => {
    setPermissions({ module: { ministere: true } })
    const wrapper = await mountGeneralInfo()
    expect(wrapper.find('[name="numeroPegase"]').exists()).toBe(true)
    expect(wrapper.find('[name="accommodationZone"]').exists()).toBe(true)
  })
})

describe('BeneficiaryFormGeneralInformation - module.vulnerablePerson', () => {
  beforeEach(() => {
    setPermissions({})
  })

  it('hides vulnerablePerson checkbox when module.vulnerablePerson is false', async () => {
    const wrapper = await mountGeneralInfo()
    expect(wrapper.find('[name="vulnerablePerson"]').exists()).toBe(false)
  })

  it('shows vulnerablePerson checkbox when module.vulnerablePerson is true', async () => {
    setPermissions({ module: { vulnerablePerson: true } })
    const wrapper = await mountGeneralInfo()
    expect(wrapper.find('[name="vulnerablePerson"]').exists()).toBe(true)
  })
})

describe('BeneficiaryFormGeneralInformation - permissions.changeReferent', () => {
  it('referents select is disabled when changeReferent is false', async () => {
    const wrapper = await mountGeneralInfo({ changeReferent: false })
    expect(
      wrapper.find<HTMLInputElement>('[name="referents"]').element.disabled
    ).toBe(true)
  })

  it('referents select is enabled when changeReferent is true', async () => {
    const wrapper = await mountGeneralInfo({ changeReferent: true })
    expect(
      wrapper.find<HTMLInputElement>('[name="referents"]').element.disabled
    ).toBe(false)
  })
})
