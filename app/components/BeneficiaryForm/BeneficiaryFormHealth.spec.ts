// @vitest-environment nuxt
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { withForm } from '~~/test/components/helpers'
import {
  setPermissions,
  resetPermissions
} from '~~/test/components/fake-permissions'
import { updateBeneficiaryHealthSchema } from '~~/server/schema'
import BeneficiaryFormHealth from './BeneficiaryFormHealth.vue'

function mountHealthForm() {
  return mountSuspended(
    withForm(BeneficiaryFormHealth, updateBeneficiaryHealthSchema)
  )
}

afterEach(resetPermissions)

describe('BeneficiaryFormHealth - edit.health.nir', () => {
  beforeEach(resetPermissions)

  it('hides socialSecurityNumber when edit.health.nir is false', async () => {
    const wrapper = await mountHealthForm()
    expect(wrapper.find('[name="socialSecurityNumber"]').exists()).toBe(false)
  })

  it('shows socialSecurityNumber when edit.health.nir is true', async () => {
    setPermissions({ edit: { health: { nir: true } } })
    const wrapper = await mountHealthForm()
    expect(wrapper.find('[name="socialSecurityNumber"]').exists()).toBe(true)
  })
})
