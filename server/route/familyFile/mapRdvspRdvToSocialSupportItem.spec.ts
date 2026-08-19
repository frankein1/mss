import { describe, it, expect } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { SocialSupportStatus, SocialSupportType } from '@prisma/client'
import { RdvspStatus } from '~~/types/rdvsp'
import type { RdvspRdv } from '~~/server/lib/rdvsp-oauth.client'
import type { EnrichedAppointment } from '~~/server/services/rdvsp/get-appointments.service'
import { mapRdvspRdvToSocialSupportItem } from './get-social-supports.query'

mockNuxtImport('useRuntimeConfig', () => {
  return () => ({
    app: { baseURL: '/' },
    rdvsp: { issuer: 'https://demo.anct.gouv.fr' }
  })
})

function createRdv(overrides: Partial<RdvspRdv> = {}): RdvspRdv {
  return {
    id: 1,
    address: '1 rue de la Paix',
    agents: [{ id: 100, first_name: 'Agent', last_name: 'Smith' }],
    created_by_id: 100,
    duration_in_min: 30,
    motif: {
      id: 1,
      name: 'Consultation',
      collectif: false,
      location_type: 'public_office'
    },
    status: RdvspStatus.Unknown,
    collectif: false,
    starts_at: '2026-06-01T10:00:00+02:00',
    users: [{ id: 42, first_name: 'Jean', last_name: 'Dupont' }],
    participations: [
      {
        id: 10,
        status: RdvspStatus.Seen,
        user: { id: 42, first_name: 'Jean', last_name: 'Dupont' }
      }
    ],
    url_for_agents: 'https://rdv.example.com/rdvs/1',
    ...overrides
  }
}

function createEnriched(
  overrides: Partial<Omit<EnrichedAppointment, 'rdv'>> & {
    rdv?: Partial<RdvspRdv>
  } = {}
): EnrichedAppointment {
  const { rdv, ...rest } = overrides
  return {
    rdv: createRdv(rdv),
    status: RdvspStatus.Seen,
    rdvMetadata: { collectif: false },
    beneficiary: { firstName: 'Jean', usualName: 'Dupont' },
    ...rest
  }
}

// The mapper is a pure shaper: participation match, status resolution and the
// beneficiaryId join are covered by the helper spec and the getAppointments
// service, not here.
describe('mapRdvspRdvToSocialSupportItem', () => {
  it('shapes an individual appointment with a plain motif name subtype', () => {
    const result = mapRdvspRdvToSocialSupportItem(
      createEnriched({
        status: RdvspStatus.Seen,
        rdvMetadata: { collectif: false },
        beneficiary: { firstName: 'Jean', usualName: 'Dupont' }
      })
    )

    expect(result).toEqual({
      id: '1',
      createdBy: { firstName: 'Agent', lastName: 'Smith' },
      beneficiary: { firstName: 'Jean', usualName: 'Dupont' },
      status: SocialSupportStatus.RdvSeen,
      date: new Date('2026-06-01T10:00Z'),
      socialSupportType: SocialSupportType.Appointment,
      subtype: 'Consultation',
      rdvMetadata: { collectif: false }
    })
  })

  it('places the collective flag and beneficiaryId in rdvMetadata without prefixing the subtype', () => {
    const result = mapRdvspRdvToSocialSupportItem(
      createEnriched({
        rdv: {
          motif: {
            id: 1,
            name: 'Atelier',
            collectif: true,
            location_type: 'public_office'
          }
        },
        status: RdvspStatus.Excused,
        rdvMetadata: { collectif: true, beneficiaryId: 'beneficiary-uuid' },
        beneficiary: { firstName: 'Marie', usualName: 'Martin' }
      })
    )

    expect(result).toMatchObject({
      status: SocialSupportStatus.RdvExcused,
      beneficiary: { firstName: 'Marie', usualName: 'Martin' },
      subtype: 'Atelier',
      rdvMetadata: { collectif: true, beneficiaryId: 'beneficiary-uuid' }
    })
  })
})
