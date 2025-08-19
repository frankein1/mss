import { getAppContextPermissions } from '~/server/security'
import { StructureType } from '@prisma/client'
import { StructureRepo } from '~/server/database'

/* Verify current session and initialize permissions after login */
export default defineEventHandler(async event => {
  // Verified jwt token retrieved from context
  const jwtUser = event.context.auth?.user

  if (!jwtUser) {
    return null
  }

  // Retrieve permissions for admin role
  if (jwtUser.role === 'Administrator') {
    const permissions = getAppContextPermissions({
      user: jwtUser,
      structure: null
    })

    return { user: jwtUser, permissions }
  }

  // Retrieve permissions for other roles
  if (!jwtUser.structureId) {
    throw new Error('verify-session: missing structure id')
  }

  const structure = await StructureRepo.findUniqueOrThrow(jwtUser, {
    where: { id: jwtUser.structureId },
    select: { externalRdvspActive: true }
  })

  // The permissions are retrieved from the auth token
  // If the user's permissions have changed meanwhile, they
  // won't be updated in the new issued token
  const permissions = getAppContextPermissions({
    user: jwtUser,
    structure: {
      id: jwtUser.structureId,
      type: jwtUser.structureType as StructureType,
      externalRdvspActive: structure.externalRdvspActive
    }
  })

  return { user: jwtUser, permissions }
})
