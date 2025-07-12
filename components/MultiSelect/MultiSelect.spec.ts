// @vitest-environment happy-dom
import {
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
  describe,
  test,
  expect
} from 'vitest'
import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'

import MultiSelect from './MultiSelect.vue'

let wrapper: VueWrapper
let outside: VueWrapper

beforeAll(() => {
  outside = mount(
    { template: '<div class="outside"/>' },
    { attachTo: document.body }
  )
})

afterAll(() => outside.unmount())

beforeEach(() => {
  wrapper = mount(MultiSelect, {
    props: {
      name: 'documents',
      label: 'Field Label',
      options: [
        { value: '01', label: 'Ain' },
        { value: '02', label: 'Aisne' }
      ]
    },
    attachTo: document.body
  })
})

afterEach(() => wrapper.unmount())

describe('MultiSelect component', () => {
  test('renders properly', async () => {
    expect(wrapper.text()).toContain('Field Label')
  })

  test('shows dropdown menu with search bar and list of suggestions when input is clicked', async () => {
    await wrapper.find('input[name="documents"]').trigger('click')

    const dropdown = wrapper.find('.multiselect-content')
    expect(dropdown.exists()).toBe(true)
    expect(dropdown.isVisible()).toBe(true)
    expect(wrapper.find('input[type="search"]').isVisible()).toBe(true)
    expect(dropdown.findAll('.option-item')).toHaveLength(2)
  })

  test('shows selected item label in field when item is selected from the dropdown', async () => {
    const input = wrapper.find('input[name="documents"]')
    await input.trigger('click')

    await wrapper.find('input[label="Ain"]').trigger('click')

    expect(input.attributes('value')).toBe('Ain')
  })

  test('shows selected item label in field when item programmatically selected', async () => {
    const input = wrapper.find('input[name="documents"]')

    await (wrapper.vm as any).triggerSelectValue('02')

    expect(input.attributes('value')).toBe('Aisne')
  })

  test('can select 2 objects from the dropdown and preserve their order from the list', async () => {
    const input = wrapper.find('input[name="documents"]')
    await input.trigger('click')

    await wrapper.find('input[label="Aisne"]').trigger('click')
    await wrapper.find('input[label="Ain"]').trigger('click')

    expect(input.attributes('value')).toBe('Ain, Aisne')
  })

  test('can programmatically select 2 objects', async () => {
    const input = wrapper.find('input[name="documents"]')
    await input.trigger('click')

    await (wrapper.vm as any).triggerSelectValue('02')
    await (wrapper.vm as any).triggerSelectValue('01')

    expect(input.attributes('value')).toBe('Ain, Aisne')
  })

  test('can mix programmatical selection and selection from interface', async () => {
    const input = wrapper.find('input[name="documents"]')
    await input.trigger('click')

    await wrapper.find('input[label="Aisne"]').trigger('click')
    await (wrapper.vm as any).triggerSelectValue('01')

    expect(input.attributes('value')).toBe('Ain, Aisne')
  })
})
