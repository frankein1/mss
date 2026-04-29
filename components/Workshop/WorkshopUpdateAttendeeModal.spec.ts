import { describe, test, expect, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import {
  WorkshopAttendeeAttendance,
  WorkshopAttendeeListType,
  WorkshopAttendeeType
} from '@prisma/client'
import WorkshopUpdateAttendeeModal from './WorkshopUpdateAttendeeModal.vue'
import type { WorkshopAttendee } from '~/types/workshop'

mockNuxtImport('useModal', () => () => ({ close: vi.fn(), open: vi.fn() }))
mockNuxtImport('useSnackbar', () => () => ({
  error: vi.fn(),
  success: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  focus: vi.fn()
}))
mockNuxtImport('useTrpcClient', () => () => ({
  workshop: {
    updateAttendee: {
      useMutation: () => ({
        mutate: vi.fn(),
        status: ref('idle'),
        error: ref(null)
      })
    }
  }
}))

function makeAttendee(
  overrides: Partial<WorkshopAttendee> = {}
): WorkshopAttendee {
  return {
    id: '1',
    workshopId: '2',
    beneficiaryId: '3',
    firstName: 'Jean',
    lastName: 'DUPONT',
    created: new Date(),
    updated: new Date(),
    zipcode: null,
    street: null,
    gender: null,
    phone: null,
    email: null,
    birthDate: null,
    city: null,
    comment: null,
    attendance: WorkshopAttendeeAttendance.Seen,
    listType: WorkshopAttendeeListType.Main,
    paymentReceived: null,
    paymentAmount: null,
    ...overrides,
    type: WorkshopAttendeeType.Beneficiary
  }
}

describe('WorkshopUpdateAttendeeModal - paymentReceived pre-selection', () => {
  test('no radio is pre-selected when paymentReceived is null', async () => {
    const wrapper = await mountSuspended(WorkshopUpdateAttendeeModal, {
      props: {
        attendee: makeAttendee({ paymentReceived: null }),
        isWorkshopChargeable: true,
        refresh: vi.fn()
      }
    })

    const radios = wrapper.findAll<HTMLInputElement>(
      'input[type="radio"][name="paymentReceived"]'
    )
    expect(radios.length).toBeGreaterThan(0)
    expect(radios.every(r => !r.element.checked)).toBe(true)
  })

  test('"Payé" is pre-selected when paymentReceived is true', async () => {
    const wrapper = await mountSuspended(WorkshopUpdateAttendeeModal, {
      props: {
        attendee: makeAttendee({ paymentReceived: true }),
        isWorkshopChargeable: true,
        refresh: vi.fn()
      }
    })

    const payeRadio = wrapper.find<HTMLInputElement>(
      'input[type="radio"][name="paymentReceived"][value="true"]'
    )
    expect(payeRadio.element.checked).toBe(true)
  })

  test('"Non payé" is pre-selected when paymentReceived is false', async () => {
    const wrapper = await mountSuspended(WorkshopUpdateAttendeeModal, {
      props: {
        attendee: makeAttendee({ paymentReceived: false }),
        isWorkshopChargeable: true,
        refresh: vi.fn()
      }
    })

    const nonPayeRadio = wrapper.find<HTMLInputElement>(
      'input[type="radio"][name="paymentReceived"][value="false"]'
    )
    expect(nonPayeRadio.element.checked).toBe(true)
  })
})
