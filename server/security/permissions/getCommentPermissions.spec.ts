import { test, describe, expect } from 'vitest'
import { getCommentPermissions } from './getCommentPermissions'
import type { SecurityRuleContext } from '../rules'
import { UserRole } from '~/prisma/generated/client'

const CTX_BASE: SecurityRuleContext = {
  user: {
    id: 'dummy-user-id',
    role: 'StructureManager',
    status: 'Active',
    structureId: 'dummy-structure-id'
  },
  structure: {
    id: 'dummy-structure-id',
    type: 'Association',
    externalRdvspActive: null
  }
}

describe.each(Object.values(UserRole))(`%s comment permissions`, role => {
  test(`a ${role} can edit a comment that she has created`, () => {
    const res = getCommentPermissions({
      ctx: { ...CTX_BASE, user: { ...CTX_BASE.user, role } },
      comment: { createdById: CTX_BASE.user.id }
    })

    expect(res.edit).toBe(true)
  })

  test(`a ${role} can delete a comment that she has created`, () => {
    const res = getCommentPermissions({
      ctx: { ...CTX_BASE, user: { ...CTX_BASE.user, role } },
      comment: { createdById: CTX_BASE.user.id }
    })

    expect(res.delete).toBe(true)
  })

  test(`a ${role} cannot edit a comment that she has not created`, () => {
    const res = getCommentPermissions({
      ctx: { ...CTX_BASE, user: { ...CTX_BASE.user, role } },
      comment: { createdById: 'other-id' }
    })

    expect(res.edit).toBe(false)
  })

  test(`a ${role} cannot delete a comment that she has not created`, () => {
    const res = getCommentPermissions({
      ctx: { ...CTX_BASE, user: { ...CTX_BASE.user, role } },
      comment: { createdById: 'other-id' }
    })

    expect(res.delete).toBe(false)
  })
})
