import { describe, expect, test } from 'vitest'
import { getBudgetPermissions } from './getBudgetPermissions'
import type { SecurityRuleContext } from '../rules'

const STRUCTURE_ID = '036b15e3-52a4-4df0-abf3-5c485f735bfe'
const USER_ID = '0a9d7394-2b05-4c37-adae-eaa349eddd23'
const OTHER_USER_ID = '5630e6a8-9a5e-46be-abd9-d6ac0bd0525a'

const makeCtx = (
  role: SecurityRuleContext['user']['role']
): SecurityRuleContext => ({
  user: { id: USER_ID, role, status: 'Active', structureId: STRUCTURE_ID },
  structure: { id: STRUCTURE_ID, type: 'Ccas', externalRdvspActive: null }
})

const FAMILY_FILE_ASSIGNED = {
  structureId: STRUCTURE_ID,
  referents: [{ id: USER_ID }]
}
const FAMILY_FILE_NOT_ASSIGNED = {
  structureId: STRUCTURE_ID,
  referents: [{ id: OTHER_USER_ID }]
}

describe.each(['StructureManager', 'SocialWorker', 'Instructor'] as const)(
  '%s budget permissions',
  role => {
    test(`a ${role} can view and edit a budget regardless of referent assignment`, () => {
      const res = getBudgetPermissions({
        ctx: makeCtx(role),
        familyFile: FAMILY_FILE_NOT_ASSIGNED
      })

      expect(res.view).toBe(true)
      expect(res.edit).toBe(true)
    })
  }
)

describe('ReceptionAgent budget permissions', () => {
  test('a ReceptionAgent cannot view or edit a budget even when assigned as referent', () => {
    const res = getBudgetPermissions({
      ctx: makeCtx('ReceptionAgent'),
      familyFile: FAMILY_FILE_ASSIGNED
    })

    expect(res.view).toBe(false)
    expect(res.edit).toBe(false)
  })
})

describe('Referent budget permissions', () => {
  test('a Referent can view and edit a budget when assigned to the family file', () => {
    const res = getBudgetPermissions({
      ctx: makeCtx('Referent'),
      familyFile: FAMILY_FILE_ASSIGNED
    })

    expect(res.view).toBe(true)
    expect(res.edit).toBe(true)
  })

  test('a Referent cannot view or edit a budget when not assigned to the family file', () => {
    const res = getBudgetPermissions({
      ctx: makeCtx('Referent'),
      familyFile: FAMILY_FILE_NOT_ASSIGNED
    })

    expect(res.view).toBe(false)
    expect(res.edit).toBe(false)
  })
})
