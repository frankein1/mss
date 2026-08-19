// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'

describe('v-autofocus directive', () => {
  it('focuses the first input when mounted without arguments', async () => {
    const Wrapper = defineComponent({
      template: '<div v-autofocus><span>text</span><input type="text" /></div>'
    })

    const wrapper = await mountSuspended(Wrapper, {
      attachTo: document.body
    })

    expect(document.activeElement).toBe(wrapper.find('input').element)
    wrapper.unmount()
  })

  it('focuses the first select when no input precedes it', async () => {
    const Wrapper = defineComponent({
      template:
        '<div v-autofocus><span>text</span><select><option>a</option></select></div>'
    })

    const wrapper = await mountSuspended(Wrapper, {
      attachTo: document.body
    })

    expect(document.activeElement).toBe(wrapper.find('select').element)
    wrapper.unmount()
  })

  it('focuses the first textarea when no input or select precedes it', async () => {
    const Wrapper = defineComponent({
      template: '<div v-autofocus><span>text</span><textarea></textarea></div>'
    })

    const wrapper = await mountSuspended(Wrapper, {
      attachTo: document.body
    })

    expect(document.activeElement).toBe(wrapper.find('textarea').element)
    wrapper.unmount()
  })

  it('focuses the element matching a custom selector argument', async () => {
    const Wrapper = defineComponent({
      template:
        '<div v-autofocus="\'textarea\'"><input type="text" /><textarea></textarea></div>'
    })

    const wrapper = await mountSuspended(Wrapper, {
      attachTo: document.body
    })

    expect(document.activeElement).toBe(wrapper.find('textarea').element)
    wrapper.unmount()
  })

  it('does not throw when no focusable child exists', async () => {
    const Wrapper = defineComponent({
      template: '<div v-autofocus><span>no focusable here</span></div>'
    })

    const wrapper = await mountSuspended(Wrapper, {
      attachTo: document.body
    })

    expect(document.activeElement).not.toBe(wrapper.find('span').element)
    wrapper.unmount()
  })
})
