import { describe, test, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import { useForm } from 'vee-validate'
import HelpRequestFormContextSection from './HelpRequestFormContextSection.vue'

function mountWithIsFirst(isFirstValue?: 'true' | 'false') {
  const Wrapper = defineComponent({
    components: { HelpRequestFormContextSection },
    setup() {
      useForm({ initialValues: { isFirst: isFirstValue } })
      return {}
    },
    template: `<HelpRequestFormContextSection
      :isHousingSupport="true"
      :isExternalSupport="false"
      :hasSetExternalStructure="false"
      :socialSupportSubjects="[]"
      :partnerOrganizations="[]"
    />`
  })
  return mountSuspended(Wrapper)
}

describe('HelpRequestFormContextSection - firstOpeningDate conditional field', () => {
  test('firstOpeningDate is not shown when isFirst is not set', async () => {
    const wrapper = await mountWithIsFirst(undefined)

    expect(wrapper.find('input[name="firstOpeningDate"]').exists()).toBe(false)
  })

  test('firstOpeningDate is not shown when isFirst is "true"', async () => {
    const wrapper = await mountWithIsFirst('true')

    expect(wrapper.find('input[name="firstOpeningDate"]').exists()).toBe(false)
  })

  test('firstOpeningDate is shown when isFirst is "false"', async () => {
    const wrapper = await mountWithIsFirst('false')

    expect(wrapper.find('input[name="firstOpeningDate"]').exists()).toBe(true)
  })
})
