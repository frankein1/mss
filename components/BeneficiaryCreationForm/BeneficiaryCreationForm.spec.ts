// @vitest-environment nuxt
import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { setPermissions, submitForm } from '~/test/components/helpers'
import {
  createFakeTrpcClientBeneficiary,
  createFakeAgent
} from '~/test/components/beneficiary/helpers'
import MultiSelect from '~/components/MultiSelect/MultiSelect.vue'
import BeneficiaryCreationForm from './BeneficiaryCreationForm.vue'

const fakeTrpcClient = createFakeTrpcClientBeneficiary()
mockNuxtImport('useTrpcClient', () => () => fakeTrpcClient)

mockNuxtImport('useLeaveFormConfirmation', () => () => ({
  isNavigatingWithFormActions: ref(false)
}))

function mountCreationForm(agents = [createFakeAgent()]) {
  return mountSuspended(BeneficiaryCreationForm, {
    props: { isSubmitting: false, agents }
  })
}

describe('BeneficiaryCreationForm - permissions', () => {
  beforeEach(() => {
    setPermissions({})
  })

  it('hides numeroPegase when module.ministere is false', async () => {
    const wrapper = await mountCreationForm()
    expect(wrapper.find('[name="numeroPegase"]').exists()).toBe(false)
  })

  it('shows numeroPegase when module.ministere is true', async () => {
    setPermissions({ module: { ministere: true } })
    const wrapper = await mountCreationForm()
    expect(wrapper.find('[name="numeroPegase"]').exists()).toBe(true)
  })
})

describe('BeneficiaryCreationForm - module.vulnerablePerson', () => {
  beforeEach(() => {
    setPermissions({})
  })

  it('hides vulnerablePerson checkbox when module.vulnerablePerson is false', async () => {
    const wrapper = await mountCreationForm()
    expect(wrapper.find('[name="vulnerablePerson"]').exists()).toBe(false)
  })

  it('hides vulnerablePerson checkbox even when module.vulnerablePerson is true because creation form does not show the full form', async () => {
    setPermissions({ module: { vulnerablePerson: true } })
    const wrapper = await mountCreationForm()
    expect(wrapper.find('[name="vulnerablePerson"]').exists()).toBe(false)
  })
})

describe('BeneficiaryCreationForm - submission', () => {
  beforeEach(() => {
    setPermissions({})
  })

  it('does not emit saveBeneficiary when required fields are missing', async () => {
    const wrapper = await mountCreationForm([])
    await submitForm(wrapper)
    expect(wrapper.emitted('saveBeneficiary')).toBeUndefined()
  })

  it('emits saveBeneficiary when a referent is selected', async () => {
    const agent = createFakeAgent()
    const wrapper = await mountCreationForm([agent])
    const multiSelect = wrapper.findComponent(MultiSelect)
    await (multiSelect.vm as any).triggerSelectValue(agent.id)
    await flushPromises()
    await submitForm(wrapper)
    expect(wrapper.emitted('saveBeneficiary')).toBeTruthy()
  })
})
