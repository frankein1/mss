import { describe, it, expect } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { SocialSupportStatus, SocialSupportType } from '@prisma/client'
import { RdvspStatus } from '~~/types/rdvsp'
import type { RdvspRdv } from '~~/server/lib/rdvsp-oauth.client'
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

describe('mapRdvspRdvToSocialSupportItem', () => {
  it('uses participation status for an individual RDV', () => {
    const rdv = createRdv({
      status: RdvspStatus.Unknown,
      participations: [
        {
          id: 10,
          status: RdvspStatus.Seen,
          user: { id: 42, first_name: 'Jean', last_name: 'Dupont' }
        }
      ]
    })

    const result = mapRdvspRdvToSocialSupportItem(rdv, [42])

    expect(result).toMatchObject({
      status: SocialSupportStatus.RdvSeen,
      socialSupportType: SocialSupportType.Appointment
    })
  })

  it('extracts the correct beneficiary participation status for a collective RDV', () => {
    const rdv = createRdv({
      collectif: true,
      motif: {
        id: 1,
        name: 'Atelier',
        collectif: true,
        location_type: 'public_office'
      },
      status: RdvspStatus.Unknown,
      participations: [
        {
          id: 10,
          status: RdvspStatus.Seen,
          user: { id: 42, first_name: 'Jean', last_name: 'Dupont' }
        },
        {
          id: 11,
          status: RdvspStatus.Excused,
          user: { id: 99, first_name: 'Marie', last_name: 'Martin' }
        }
      ]
    })

    const result = mapRdvspRdvToSocialSupportItem(rdv, [99])

    expect(result).toMatchObject({
      status: SocialSupportStatus.RdvExcused,
      beneficiary: { firstName: 'Marie', usualName: 'Martin' },
      subtype: '[Collectif] Atelier',
      beneficiaryExternalRdvspId: 99
    })
  })

  it('returns null when no matching participation is found', () => {
    const rdv = createRdv({
      participations: [
        {
          id: 10,
          status: RdvspStatus.Seen,
          user: { id: 42, first_name: 'Jean', last_name: 'Dupont' }
        }
      ]
    })

    const result = mapRdvspRdvToSocialSupportItem(rdv, [999])

    expect(result).toBeNull()
  })

  it('falls back to RDV status when participations array is empty', () => {
    const rdv = createRdv({
      status: RdvspStatus.Revoked,
      participations: []
    })

    const result = mapRdvspRdvToSocialSupportItem(rdv, [42])

    expect(result).toMatchObject({
      status: SocialSupportStatus.RdvRevoked
    })
  })
})
