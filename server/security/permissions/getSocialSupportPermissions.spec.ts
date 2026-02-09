import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import type { SecurityRuleContext } from '../rules'
import {
  FixtureStructure,
  fixtureStructures,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { getSocialSupportPermissions } from './getSocialSupportPermissions'
import { SocialSupportType } from '~/prisma/generated/client'

const CTX_SM: SecurityRuleContext = {
  user: {
    id: fixturesUsers[FixtureUserRole.StructureManager].id,
    role: 'StructureManager',
    status: 'Active',
    structureId: fixtureStructures[FixtureStructure.Test].id
  },
  structure: {
    id: fixtureStructures[FixtureStructure.Test].id,
    type: 'Ccas',
    externalRdvspActive: null
  }
}
const CTX_SW: SecurityRuleContext = {
  user: {
    id: fixturesUsers[FixtureUserRole.SocialWorker].id,
    role: 'SocialWorker',
    status: 'Active',
    structureId: fixtureStructures[FixtureStructure.Test].id
  },
  structure: CTX_SM.structure
}
const CTX_INST: SecurityRuleContext = {
  user: {
    id: fixturesUsers[FixtureUserRole.Instructor].id,
    role: 'Instructor',
    status: 'Active',
    structureId: fixtureStructures[FixtureStructure.Test].id
  },
  structure: CTX_SM.structure
}
const CTX_REF: SecurityRuleContext = {
  user: {
    id: fixturesUsers[FixtureUserRole.Referent].id,
    role: 'Referent',
    status: 'Active',
    structureId: fixtureStructures[FixtureStructure.Test].id
  },
  structure: CTX_SM.structure
}
const CTX_RA: SecurityRuleContext = {
  user: {
    id: fixturesUsers[FixtureUserRole.ReceptionAgent].id,
    role: 'ReceptionAgent',
    status: 'Active',
    structureId: fixtureStructures[FixtureStructure.Test].id
  },
  structure: CTX_SM.structure
}

describe('getSocialSupportPermissions', () => {
  // structure manager
  test(`a ${CTX_SM.user.role} can edit a social supports that she has not created`, () => {
    const res = getSocialSupportPermissions({
      ctx: { ...CTX_SM, user: { ...CTX_SM.user } },
      familyFile: {
        structureId: fixtureStructures[FixtureStructure.Test].id,
        referents: [fixturesUsers[FixtureUserRole.ReceptionAgent].id]
      },
      socialSupport: {
        createdById: fixturesUsers[FixtureUserRole.ReceptionAgent].id,
        structureId: fixtureStructures[FixtureStructure.Test].id,
        socialSupportType: SocialSupportType.HelpRequest
      }
    })
    expect(res.edit).toBe(true)
  })

  test(`a ${CTX_SM.user.role}  can edit a social supports that she has created`, () => {
    const res = getSocialSupportPermissions({
      ctx: { ...CTX_SM, user: { ...CTX_SM.user } },
      familyFile: {
        structureId: fixtureStructures[FixtureStructure.Test].id,
        referents: [fixturesUsers[FixtureUserRole.ReceptionAgent].id]
      },
      socialSupport: {
        createdById: fixturesUsers[FixtureUserRole.StructureManager].id,
        structureId: fixtureStructures[FixtureStructure.Test].id,
        socialSupportType: SocialSupportType.HelpRequest
      }
    })
    expect(res.edit).toBe(true)
  })

  // social worker
  test(`a ${CTX_SW.user.role} cannot edit a social supports that she has not created`, () => {
    const res = getSocialSupportPermissions({
      ctx: { ...CTX_SW, user: { ...CTX_SW.user } },
      familyFile: {
        structureId: fixtureStructures[FixtureStructure.Test].id,
        referents: [fixturesUsers[FixtureUserRole.ReceptionAgent].id]
      },
      socialSupport: {
        createdById: fixturesUsers[FixtureUserRole.StructureManager].id,
        structureId: fixtureStructures[FixtureStructure.Test].id,
        socialSupportType: SocialSupportType.HelpRequest
      }
    })
    expect(res.edit).toBe(false)
  })

  test(`a ${CTX_SW.user.role} can edit a social supports if she is referent`, () => {
    const res = getSocialSupportPermissions({
      ctx: { ...CTX_SW, user: { ...CTX_SW.user } },
      familyFile: {
        structureId: fixtureStructures[FixtureStructure.Test].id,
        referents: [fixturesUsers[FixtureUserRole.SocialWorker].id]
      },
      socialSupport: {
        createdById: fixturesUsers[FixtureUserRole.SocialWorker].id,
        structureId: fixtureStructures[FixtureStructure.Test].id,
        socialSupportType: SocialSupportType.HelpRequest
      }
    })
    expect(res.edit).toBe(true)
  })

  // Instructor
  test(`a ${CTX_INST.user.role} cannot edit a social support if she is not creator`, () => {
    const res = getSocialSupportPermissions({
      ctx: { ...CTX_INST, user: { ...CTX_INST.user } },
      familyFile: {
        structureId: fixtureStructures[FixtureStructure.Test].id,
        referents: [fixturesUsers[FixtureUserRole.SocialWorker].id]
      },
      socialSupport: {
        createdById: fixturesUsers[FixtureUserRole.SocialWorker].id,
        structureId: fixtureStructures[FixtureStructure.Test].id,
        socialSupportType: SocialSupportType.HelpRequest
      }
    })
    expect(res.edit).toBe(false)
  })

  test(`a ${CTX_INST.user.role} can edit a social support if she is creator`, () => {
    const res = getSocialSupportPermissions({
      ctx: { ...CTX_INST, user: { ...CTX_INST.user } },
      familyFile: {
        structureId: fixtureStructures[FixtureStructure.Test].id,
        referents: [fixturesUsers[FixtureUserRole.SocialWorker].id]
      },
      socialSupport: {
        createdById: fixturesUsers[FixtureUserRole.Instructor].id,
        structureId: fixtureStructures[FixtureStructure.Test].id,
        socialSupportType: SocialSupportType.HelpRequest
      }
    })
    expect(res.edit).toBe(true)
  })

  // Referent
  test(`a ${CTX_REF.user.role} can edit a social support if she is creator or referent`, () => {
    const res = getSocialSupportPermissions({
      ctx: { ...CTX_REF, user: { ...CTX_REF.user } },
      familyFile: {
        structureId: fixtureStructures[FixtureStructure.Test].id,
        referents: [fixturesUsers[FixtureUserRole.Referent].id]
      },
      socialSupport: {
        createdById: fixturesUsers[FixtureUserRole.StructureManager].id,
        structureId: fixtureStructures[FixtureStructure.Test].id,
        socialSupportType: SocialSupportType.HelpRequest
      }
    })
    expect(res.edit).toBe(true)

    const response_two = getSocialSupportPermissions({
      ctx: { ...CTX_REF, user: { ...CTX_REF.user } },
      familyFile: {
        structureId: fixtureStructures[FixtureStructure.Test].id,
        referents: [fixturesUsers[FixtureUserRole.Instructor].id]
      },
      socialSupport: {
        createdById: fixturesUsers[FixtureUserRole.Referent].id,
        structureId: fixtureStructures[FixtureStructure.Test].id,
        socialSupportType: SocialSupportType.HelpRequest
      }
    })
    expect(response_two.edit).toBe(true)
  })

  test(`a ${CTX_REF.user.role} cannot edit a social support if she is not creator or referent`, () => {
    const res = getSocialSupportPermissions({
      ctx: { ...CTX_REF, user: { ...CTX_REF.user } },
      familyFile: {
        structureId: fixtureStructures[FixtureStructure.Test].id,
        referents: [fixturesUsers[FixtureUserRole.Instructor].id]
      },
      socialSupport: {
        createdById: fixturesUsers[FixtureUserRole.Instructor].id,
        structureId: fixtureStructures[FixtureStructure.Test].id,
        socialSupportType: SocialSupportType.HelpRequest
      }
    })
    expect(res.edit).toBe(false)
  })

  // Reception Agent
  test.skip(`a ${CTX_RA.user.role} can edit a social support only if she is creator or referent`, () => {
    const res = getSocialSupportPermissions({
      ctx: { ...CTX_RA, user: { ...CTX_RA.user } },
      familyFile: {
        structureId: fixtureStructures[FixtureStructure.Test].id,
        referents: [fixturesUsers[FixtureUserRole.ReceptionAgent].id]
      },
      socialSupport: {
        createdById: fixturesUsers[FixtureUserRole.StructureManager].id,
        structureId: fixtureStructures[FixtureStructure.Test].id,
        socialSupportType: SocialSupportType.HelpRequest
      }
    })
    // TODO: FIX ME - this should be true according to role definitions table
    expect(res.edit).toBe(true)

    const response_two = getSocialSupportPermissions({
      ctx: { ...CTX_RA, user: { ...CTX_RA.user } },
      familyFile: {
        structureId: fixtureStructures[FixtureStructure.Test].id,
        referents: [fixturesUsers[FixtureUserRole.Instructor].id]
      },
      socialSupport: {
        createdById: fixturesUsers[FixtureUserRole.ReceptionAgent].id,
        structureId: fixtureStructures[FixtureStructure.Test].id,
        socialSupportType: SocialSupportType.HelpRequest
      }
    })
    expect(response_two.edit).toBe(true)
  })
})
