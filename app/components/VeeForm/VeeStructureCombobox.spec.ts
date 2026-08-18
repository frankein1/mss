// @vitest-environment nuxt
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import VeeStructureCombobox from './VeeStructureCombobox.vue'
import { waitForDebounce } from '~~/test/components/helpers'

const getStructuresMock = vi.fn()

const fakeTrpcClient = {
  admin: {
    getStructures: {
      query: getStructuresMock
    }
  }
}

mockNuxtImport('useTrpcClient', () => () => fakeTrpcClient)

const structureA = {
  id: 's-a',
  name: 'CCAS Alpha',
  type: 'Ccas',
  city: 'Alphaville',
  zipcode: '11111'
}

const structureB = {
  id: 's-b',
  name: 'CCAS Beta',
  type: 'Ccas',
  city: 'Betaville',
  zipcode: '22222'
}

describe('VeeStructureCombobox - Options rendering', () => {
  beforeEach(() => {
    getStructuresMock.mockReset()
    getStructuresMock.mockResolvedValue({
      structures: [structureA, structureB]
    })
  })

  it('renders each option with name, type, city and zipcode on one line', async () => {
    const wrapper = await mountSuspended(VeeStructureCombobox)
    await flushPromises()

    const input = wrapper.find<HTMLInputElement>('input[type="search"]')
    input.element.value = 'CCAS'
    await input.trigger('input')
    await waitForDebounce()

    const options = wrapper.findAll('li[role="option"]')
    expect(options).toHaveLength(2)

    const firstText = options[0]!.text()
    expect(firstText).toContain('CCAS Alpha')
    expect(firstText).toContain('CCAS')
    expect(firstText).toContain('Alphaville')
    expect(firstText).toContain('11111')
  })

  it('filters the current structure id out of the rendered options', async () => {
    const wrapper = await mountSuspended(VeeStructureCombobox, {
      props: { excludeStructureId: structureA.id }
    })
    await flushPromises()

    const input = wrapper.find<HTMLInputElement>('input[type="search"]')
    input.element.value = 'CCAS'
    await input.trigger('input')
    await waitForDebounce()

    const options = wrapper.findAll('li[role="option"]')
    expect(options).toHaveLength(1)
    expect(options[0]!.text()).toContain('CCAS Beta')
  })
})

describe('VeeStructureCombobox - Search behaviour', () => {
  beforeEach(() => {
    getStructuresMock.mockReset()
    getStructuresMock.mockResolvedValue({ structures: [structureA] })
  })

  it('debounces and forwards the typed input as a search query', async () => {
    const wrapper = await mountSuspended(VeeStructureCombobox)
    await flushPromises()

    const input = wrapper.find<HTMLInputElement>('input[type="search"]')
    input.element.value = 'alpha'
    await input.trigger('input')
    await waitForDebounce()

    expect(getStructuresMock).toHaveBeenCalledWith({ search: 'alpha' })
  })
})

describe('VeeStructureCombobox - Select emit', () => {
  beforeEach(() => {
    getStructuresMock.mockReset()
    getStructuresMock.mockResolvedValue({ structures: [structureA] })
  })

  it('emits select with the picked structure', async () => {
    const wrapper = await mountSuspended(VeeStructureCombobox)
    await flushPromises()

    const input = wrapper.find<HTMLInputElement>('input[type="search"]')
    input.element.value = 'CCAS'
    await input.trigger('input')
    await waitForDebounce()

    const option = wrapper.find('li[role="option"]')
    await option.trigger('click')
    await flushPromises()

    const emitted = wrapper.emitted('select')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]?.[0]).toMatchObject({ id: structureA.id })
  })
})
