// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BeneficiaryHistoryDetailsHeader from './BeneficiaryHistoryDetailsHeader.vue'
import type { SocialSupportData } from './types'

const baseAppointment = {
  id: 'ss-1',
  socialSupportType: 'Appointment',
  status: 'RdvSeen',
  date: new Date('2026-06-01T10:00:00Z'),
  subtype: 'Motif RDV',
  createdBy: { firstName: 'Agent', lastName: 'Smith' },
  beneficiary: { firstName: 'Jean', usualName: 'Dupont' },
  subjects: []
} as unknown as SocialSupportData

function mountHeader(socialSupport: SocialSupportData) {
  return mountSuspended(BeneficiaryHistoryDetailsHeader, {
    props: { socialSupport, collapseId: 'collapse-ss-1' }
  })
}

describe('BeneficiaryHistoryDetailsHeader - Collective badge', () => {
  it('shows the "Collectif" badge for a collective appointment', async () => {
    const wrapper = await mountHeader({
      ...baseAppointment,
      rdvMetadata: { collectif: true, beneficiaryId: 'benef-uuid' }
    } as unknown as SocialSupportData)

    const badge = wrapper.find('.fr-badge--info')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toContain('Collectif')
  })

  it('hides the badge for an individual appointment', async () => {
    const wrapper = await mountHeader({
      ...baseAppointment,
      rdvMetadata: { collectif: false }
    } as unknown as SocialSupportData)

    expect(wrapper.find('.fr-badge--info').exists()).toBe(false)
  })

  it('hides the badge for non-appointment items', async () => {
    const wrapper = await mountHeader({
      ...baseAppointment,
      socialSupportType: 'Followup',
      subtype: undefined,
      rdvMetadata: undefined
    } as unknown as SocialSupportData)

    expect(wrapper.find('.fr-badge--info').exists()).toBe(false)
  })
})
