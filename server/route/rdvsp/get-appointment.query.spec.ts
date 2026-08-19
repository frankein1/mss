import { describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { SocialSupportStatus } from '@prisma/client'
import { RdvspStatus } from '~~/types/rdvsp'
import type { RdvspRdv } from '~~/server/lib/rdvsp-oauth.client'
import { prismaClient } from '~~/server/prisma'
import { createCaller, test } from '~~/test/server/test-utils'
import {
  fixtureStructures,
  fixturesBeneficiaries,
  FixtureBeneficiary,
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

// A seeded, active beneficiary in the caller's structure whose RDVSP id we control
// per test to drive the collective participation lookup.
const collectiveBeneficiary = fixturesBeneficiaries[FixtureBeneficiary.COURSOR]
// A beneficiary in another structure, used to prove the securityCheck rejects a
// beneficiaryId that does not belong to the caller's structure.
const otherStructureBeneficiary =
  fixturesBeneficiaries[FixtureBeneficiary.MARTIN]

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

const setBeneficiaryExternalRdvspId = (
  beneficiaryId: string,
  externalRdvspId: string | null
) =>
  prismaClient.beneficiary.update({
    where: { id: beneficiaryId },
    data: { externalRdvspId }
  })

describe('RDVSP - GetAppointment - Status resolution', () => {
  beforeEach(() => {
    mockClient.mockReset()
    vi.mocked(getAgentClient).mockReturnValue(mockClient as any)
  })

  afterEach(async () => {
    await setBeneficiaryExternalRdvspId(collectiveBeneficiary.id, null)
  })

  test('reads the rdv-level status for an individual appointment', async () => {
    const rdv = createRdvResponse({
      collectif: false,
      status: RdvspStatus.Seen,
      // A per-participation status must be ignored for individual appointments.
      participations: [
        {
          id: 10,
          status: RdvspStatus.Excused,
          user: { id: 42, first_name: 'Jean', last_name: 'Dupont' }
        }
      ]
    })
    mockClient.mockResolvedValue({ rdvs: [rdv] })
    const caller = createCaller(rdvspUser)

    const result = await caller.rdvsp.getAppointment({ id: 1 })

    expect(result.status).toBe(SocialSupportStatus.RdvSeen)
  })

  test('reads the beneficiary participation status for a collective appointment', async () => {
    await setBeneficiaryExternalRdvspId(collectiveBeneficiary.id, '99')
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
      beneficiaryId: collectiveBeneficiary.id
    })

    expect(result.status).toBe(SocialSupportStatus.RdvExcused)
    expect(result.collectif).toBe(true)
  })

  test('falls back to the rdv-level status for a collective appointment with no matching participation', async () => {
    await setBeneficiaryExternalRdvspId(collectiveBeneficiary.id, '999')
    const rdv = createRdvResponse({
      collectif: true,
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
      beneficiaryId: collectiveBeneficiary.id
    })

    expect(result.status).toBe(SocialSupportStatus.RdvNoShow)
  })
})

describe('RDVSP - GetAppointment - Authorizations', () => {
  beforeEach(() => {
    mockClient.mockReset()
    vi.mocked(getAgentClient).mockReturnValue(mockClient as any)
  })

  test('rejects when externalRdvspActive is false', async () => {
    const caller = createCaller({
      ...rdvspUser,
      structure: { ...rdvspStructure, externalRdvspActive: false }
    })

    await expect(caller.rdvsp.getAppointment({ id: 1 })).rejects.toThrow(
      /not allowed to access route/i
    )
  })

  test('rejects a beneficiaryId that belongs to another structure', async () => {
    const caller = createCaller(rdvspUser)

    await expect(
      caller.rdvsp.getAppointment({
        id: 1,
        beneficiaryId: otherStructureBeneficiary.id
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })
})
