import { vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises } from '@vue/test-utils'

export function createFakeTrpcClient() {
  return {
    partner: {
      getOne: {
        query: vi.fn()
      },
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

export function createFakePartner(
  overrides?: Record<string, unknown>
): Record<string, unknown> {
  return {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Organisme Test',
    siret: '12345678901234',
    address: '1 rue de la Paix',
    city: 'Paris',
    zipcode: '75001',
    phone1: '0100000001',
    phone2: null,
    email: 'contact@organisme.fr',
    website: 'https://organisme.fr',
    workingHours: 'Lundi-Vendredi 9h-17h',
    inactive: false,
    dataSource: 'Custom',
    dataInclusionIdV1: null,
    dataInclusionStructureV1: null,
    contacts: [],
    ...overrides
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
