import { vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises } from '@vue/test-utils'

export function createFakeTrpcClient() {
  return {
    partner: {
      findBySiret: {
        query: vi.fn().mockResolvedValue(null)
      }
    },
    dataInclusion: {
      searchStructures: {
        query: vi.fn().mockResolvedValue({ results: [] })
      }
    }
  }
}

export async function fillInput(
  wrapper: VueWrapper,
  name: string,
  value: string
) {
  const input = wrapper.find<HTMLInputElement>(`input[name="${name}"]`)
  input.element.value = value
  await input.trigger('input')
  await input.trigger('change')
}

export async function submitForm(wrapper: VueWrapper) {
  await wrapper.find('form').trigger('submit')
  await new Promise(r => setTimeout(r, 5))
  await flushPromises()
}

export async function waitForDebounce() {
  await new Promise(r => setTimeout(r, 150))
  await flushPromises()
}
