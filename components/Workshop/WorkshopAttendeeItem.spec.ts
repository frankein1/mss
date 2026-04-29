import { describe, test, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import {
  WorkshopAttendeeAttendance,
  WorkshopAttendeeListType,
  WorkshopAttendeeType
} from '@prisma/client'
import WorkshopAttendeeItem from './WorkshopAttendeeItem.vue'
import type { WorkshopAttendee } from '~/types/workshop'

function makeAttendee(
  overrides: Partial<WorkshopAttendee> = {}
): WorkshopAttendee {
  return {
    id: '1',
    created: new Date(),
    updated: new Date(),
    workshopId: '2',
    beneficiaryId: '3',
    firstName: 'Jean',
    lastName: 'DUPONT',
    gender: null,
    phone: null,
    email: null,
    birthDate: null,
    city: null,
    street: null,
    zipcode: null,
    comment: null,
    attendance: WorkshopAttendeeAttendance.Seen,
    listType: WorkshopAttendeeListType.Main,
    paymentReceived: null,
    paymentAmount: null,
    ...overrides,
    type: WorkshopAttendeeType.Beneficiary
  }
}

describe('WorkshopAttendeeItem - payment section', () => {
  const mountOptions = {
    props: {
      attendee: makeAttendee(),
      isWorkshopChargeable: true
    }
  }

  test('hides payment text and icon when paymentReceived is null', async () => {
    const wrapper = await mountSuspended(WorkshopAttendeeItem, {
      props: {
        ...mountOptions.props,
        attendee: makeAttendee({ paymentReceived: null })
      }
    })

    const payment = wrapper.find('.payment')
    expect(payment.exists()).toBe(true)
    expect(payment.text()).not.toContain('Payé')
    expect(payment.text()).not.toContain('Non payé')
    expect(payment.find('.fr-icon-check-line').exists()).toBe(false)
    expect(payment.find('.fr-icon-close-line').exists()).toBe(false)
  })

  test('shows "Payé" with valid icon when paymentReceived is true', async () => {
    const wrapper = await mountSuspended(WorkshopAttendeeItem, {
      props: {
        ...mountOptions.props,
        attendee: makeAttendee({ paymentReceived: true })
      }
    })

    const payment = wrapper.find('.payment')
    expect(payment.text()).toContain('Payé')
    expect(payment.find('.fr-icon-check-line').exists()).toBe(true)
    expect(payment.find('.fr-icon-close-line').exists()).toBe(false)
  })

  test('shows "Non payé" with error icon when paymentReceived is false', async () => {
    const wrapper = await mountSuspended(WorkshopAttendeeItem, {
      props: {
        ...mountOptions.props,
        attendee: makeAttendee({ paymentReceived: false })
      }
    })

    const payment = wrapper.find('.payment')
    expect(payment.text()).toContain('Non payé')
    expect(payment.find('.fr-icon-close-line').exists()).toBe(true)
    expect(payment.find('.fr-icon-check-line').exists()).toBe(false)
  })

  test('hides payment section when workshop is not chargeable', async () => {
    const wrapper = await mountSuspended(WorkshopAttendeeItem, {
      props: {
        attendee: makeAttendee({ paymentReceived: true }),
        isWorkshopChargeable: false
      }
    })

    expect(wrapper.find('.payment').exists()).toBe(false)
  })
})
