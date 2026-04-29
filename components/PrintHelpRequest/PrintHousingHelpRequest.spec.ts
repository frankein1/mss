import { describe, test, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { SocialSupportStatus } from '@prisma/client'
import PrintHousingHelpRequest from './PrintHousingHelpRequest.vue'

function makeHousingHelpRequest(isFirst: boolean | null) {
  return {
    isFirst,
    isPmr: false,
    maxRent: null,
    maxCharges: null,
    askedHousing: [],
    housingType: [],
    roomCount: [],
    lowIncomeHousingType: [],
    firstOpeningDate: null,
    reason: null,
    uniqueId: null,
    taxHouseholdAdditionalInformation: null,
    handlingDate: null,
    prescribingOrganization: null,
    prescribingOrganizationContact: null,
    fileInstruction: {
      externalStructure: false,
      examinationDate: null,
      decisionDate: null,
      dispatchDate: null,
      refusalReason: null,
      fullFile: false,
      instructorOrganization: null,
      instructorOrganizationContact: null,
      socialSupport: {
        date: new Date('2024-01-15'),
        status: SocialSupportStatus.InProgress,
        numeroPegase: null,
        minister: null,
        dueDate: null,
        synthesis: null,
        synthesisRichText: null,
        privateSynthesis: null,
        privateSynthesisRichText: null,
        socialSupportRedirections: [],
        beneficiary: {
          firstName: 'Jean',
          usualName: 'DUPONT'
        }
      }
    }
  }
}

describe('PrintHousingHelpRequest - isFirst display', () => {
  test('hides isFirst when value is null', async () => {
    const wrapper = await mountSuspended(PrintHousingHelpRequest, {
      props: { housingHelpRequest: makeHousingHelpRequest(null) as any }
    })

    expect(wrapper.text()).not.toContain('1ère demande')
    expect(wrapper.text()).not.toContain('Renouvellement')
  })

  test('shows "1ère demande" when isFirst is true', async () => {
    const wrapper = await mountSuspended(PrintHousingHelpRequest, {
      props: { housingHelpRequest: makeHousingHelpRequest(true) as any }
    })

    expect(wrapper.text()).toContain('1ère demande')
  })

  test('shows "Renouvellement" when isFirst is false', async () => {
    const wrapper = await mountSuspended(PrintHousingHelpRequest, {
      props: { housingHelpRequest: makeHousingHelpRequest(false) as any }
    })

    expect(wrapper.text()).toContain('Renouvellement')
  })
})
