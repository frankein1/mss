// @vitest-environment nuxt
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { withForm } from '~~/test/components/helpers'
import {
  setPermissions,
  resetPermissions
} from '~~/test/components/fake-permissions'
import { updateBeneficiaryOccupationSchema } from '~~/server/schema'
import BeneficiaryFormOccupationIncome from './BeneficiaryFormOccupationIncome.vue'

function mountOccupationForm() {
  return mountSuspended(
    withForm(
      BeneficiaryFormOccupationIncome,
      updateBeneficiaryOccupationSchema,
      {
        initialSchool: null
      }
    )
  )
}

afterEach(resetPermissions)

describe('BeneficiaryFormOccupationIncome - module.ministere', () => {
  beforeEach(resetPermissions)

  it('hides ministere fields when module.ministere is false', async () => {
    const wrapper = await mountOccupationForm()
    expect(wrapper.find('[name="ministereCategorie"]').exists()).toBe(false)
    expect(
      wrapper.find('[name="ministereDepartementServiceAc"]').exists()
    ).toBe(false)
    expect(wrapper.find('[name="ministereStructure"]').exists()).toBe(false)
  })

  it('shows ministere fields when module.ministere is true', async () => {
    setPermissions({ module: { ministere: true } })
    const wrapper = await mountOccupationForm()
    expect(wrapper.find('[name="ministereCategorie"]').exists()).toBe(true)
    expect(
      wrapper.find('[name="ministereDepartementServiceAc"]').exists()
    ).toBe(true)
    expect(wrapper.find('[name="ministereStructure"]').exists()).toBe(true)
  })
})
