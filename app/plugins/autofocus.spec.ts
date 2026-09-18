// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'

describe('v-autofocus directive', () => {
  it('focuses the element itself when mounted without arguments', async () => {
    const Wrapper = defineComponent({
      template:
        '<div><input type="text" /><button v-autofocus>ok</button></div>'
    })

    const wrapper = await mountSuspended(Wrapper, {
      attachTo: document.body
    })

    expect(document.activeElement).toBe(wrapper.find('button').element)
    wrapper.unmount()
  })

  it('focuses the element matching a custom selector argument', async () => {
    const Wrapper = defineComponent({
      template:
        '<div v-autofocus="\'textarea\'"><input type="text" /><textarea /></div>'
    })

    const wrapper = await mountSuspended(Wrapper, {
      attachTo: document.body
    })

    expect(document.activeElement).toBe(wrapper.find('textarea').element)
    wrapper.unmount()
  })

  it('does not throw when the selector matches no child', async () => {
    const Wrapper = defineComponent({
      template:
        '<div v-autofocus="\'input\'"><span>no focusable here</span></div>'
    })

    const wrapper = await mountSuspended(Wrapper, {
      attachTo: document.body
    })

    expect(document.activeElement).not.toBe(wrapper.find('span').element)
    wrapper.unmount()
  })
})
