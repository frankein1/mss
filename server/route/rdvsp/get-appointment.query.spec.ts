import { describe, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { SocialSupportStatus } from '@prisma/client'
import { RdvspStatus } from '~~/types/rdvsp'
import type { RdvspRdv } from '~~/server/lib/rdvsp-oauth.client'
import { createCaller, test } from '~~/test/server/test-utils'
import {
  fixtureStructures,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'
import { getAgentClient } from '~~/server/services/rdvsp/helper'

mockNuxtImport('useRuntimeConfig', () => {
  return () => ({
    app: { baseURL: '/' },
    rdvsp: {
      issuer: 'https://demo.anct.gouv.fr',
      clientId: 'test',
      clientSecret: 'test'
    }
  })
})

const rdvspStructure = {
  id: fixtureStructures[0].id,
  type: fixtureStructures[0].type,
  externalRdvspActive: true as boolean | null
}

const rdvspUser = {
  id: fixturesUsers[FixtureUserRole.StructureManager].id,
  structure: rdvspStructure,
  structureId: rdvspStructure.id,
  role: fixturesUsers[FixtureUserRole.StructureManager].role,
  status: fixturesUsers[FixtureUserRole.StructureManager].status
}

function createRdvResponse(overrides: Partial<RdvspRdv> = {}): RdvspRdv {
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

const mockClient = vi.fn()

describe('RDVSP - GetAppointment - Participation Status', () => {
  beforeEach(() => {
    mockClient.mockReset()
    vi.mocked(getAgentClient).mockReturnValue(mockClient as any)
  })

  test('returns participation status for an individual RDV', async () => {
    const rdv = createRdvResponse({
      status: RdvspStatus.Unknown,
      participations: [
        {
          id: 10,
          status: RdvspStatus.Seen,
          user: { id: 42, first_name: 'Jean', last_name: 'Dupont' }
        }
      ]
    })
    mockClient.mockResolvedValue({ rdvs: [rdv] })
    const caller = createCaller(rdvspUser)

    const result = await caller.rdvsp.getAppointment({
      id: 1,
      beneficiaryExternalRdvspId: 42
    })

    expect(result.status).toBe(SocialSupportStatus.RdvSeen)
  })

  test('extracts the correct beneficiary participation status for a collective RDV', async () => {
    const rdv = createRdvResponse({
      collectif: true,
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
    mockClient.mockResolvedValue({ rdvs: [rdv] })
    const caller = createCaller(rdvspUser)

    const result = await caller.rdvsp.getAppointment({
      id: 1,
      beneficiaryExternalRdvspId: 99
    })

    expect(result.status).toBe(SocialSupportStatus.RdvExcused)
    expect(result.collectif).toBe(true)
  })

  test('falls back to RDV status when participations array is empty', async () => {
    const rdv = createRdvResponse({
      status: RdvspStatus.Revoked,
      participations: []
    })
    mockClient.mockResolvedValue({ rdvs: [rdv] })
    const caller = createCaller(rdvspUser)

    const result = await caller.rdvsp.getAppointment({
      id: 1,
      beneficiaryExternalRdvspId: 42
    })

    expect(result.status).toBe(SocialSupportStatus.RdvRevoked)
  })

  test('falls back to RDV status when no matching participation exists', async () => {
    const rdv = createRdvResponse({
      status: RdvspStatus.NoShow,
      participations: [
        {
          id: 10,
          status: RdvspStatus.Seen,
          user: { id: 42, first_name: 'Jean', last_name: 'Dupont' }
        }
      ]
    })
    mockClient.mockResolvedValue({ rdvs: [rdv] })
    const caller = createCaller(rdvspUser)

    const result = await caller.rdvsp.getAppointment({
      id: 1,
      beneficiaryExternalRdvspId: 999
    })

    expect(result.status).toBe(SocialSupportStatus.RdvNoShow)
  })
})

describe('RDVSP - GetAppointment - Authorizations', () => {
  test('rejects when externalRdvspActive is false', async () => {
    const caller = createCaller({
      ...rdvspUser,
      structure: { ...rdvspStructure, externalRdvspActive: false }
    })

    await expect(
      caller.rdvsp.getAppointment({ id: 1, beneficiaryExternalRdvspId: 42 })
    ).rejects.toThrow(/not allowed to access route/i)
  })
})
