// @vitest-environment nuxt
import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import BeneficiaryHistoryDetailsAppointment from './BeneficiaryHistoryDetailsAppointment.vue'

function createMockUseQuery(appointmentData: Record<string, unknown>) {
  return () => ({
    data: ref(appointmentData),
    status: ref('success'),
    error: ref(null)
  })
}

const mockUseMutation = vi.fn(() => ({ mutate: vi.fn() }))
let mockUseQuery = createMockUseQuery({})

mockNuxtImport('useTrpcClient', () => () => ({
  rdvsp: {
    getAppointment: {
      useQuery: (...args: unknown[]) => mockUseQuery()
    },
    updateAppointmentStatus: { useMutation: mockUseMutation }
  }
}))

mockNuxtImport('useMatomo', () => () => ({
  trackEvent: vi.fn()
}))

const collectiveAppointment = {
  id: 1,
  durationInMin: 30,
  place: '1 rue de la Paix',
  url: 'https://rdv.example.com/rdvs/1',
  createdBy: { id: 100, firstName: 'Agent', lastName: 'Smith' },
  type: 'public_office',
  collectif: true,
  status: 'RdvSeen',
  date: new Date('2026-06-01T10:00:00Z')
}

const individualAppointment = {
  ...collectiveAppointment,
  collectif: false
}

describe('BeneficiaryHistoryDetailsAppointment - Collective', () => {
  it('shows a link to RDVSP and no status dropdown for collective appointments', async () => {
    mockUseQuery = createMockUseQuery(collectiveAppointment)

    const wrapper = await mountSuspended(BeneficiaryHistoryDetailsAppointment, {
      props: {
        id: 1,
        rdvMetadata: { collectif: true, beneficiaryId: 'benef-uuid' }
      }
    })

    expect(wrapper.text()).toContain(
      'Le statut de ce rendez-vous collectif ne peut être modifié que depuis RDV Service Public'
    )
    expect(wrapper.text()).toContain('Modifier dans RDV Service Public')
    expect(wrapper.find('select#select-status').exists()).toBe(false)
  })

  it('opens RDVSP link in a new tab with correct URL', async () => {
    mockUseQuery = createMockUseQuery(collectiveAppointment)

    const wrapper = await mountSuspended(BeneficiaryHistoryDetailsAppointment, {
      props: {
        id: 1,
        rdvMetadata: { collectif: true, beneficiaryId: 'benef-uuid' }
      }
    })

    const link = wrapper.find('a[target="_blank"]')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://rdv.example.com/rdvs/1')
  })
})

describe('BeneficiaryHistoryDetailsAppointment - Individual', () => {
  it('shows status dropdown and no redirect message for individual appointments', async () => {
    mockUseQuery = createMockUseQuery(individualAppointment)

    const wrapper = await mountSuspended(BeneficiaryHistoryDetailsAppointment, {
      props: { id: 1, rdvMetadata: { collectif: false } }
    })

    expect(wrapper.find('select#select-status').exists()).toBe(true)
    expect(wrapper.text()).not.toContain(
      'Le statut de ce rendez-vous collectif ne peut être modifié que depuis'
    )
  })
})
