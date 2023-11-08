import {
  getFollowupPermissions,
  getHelpRequestPermissions
} from '~/server/route/permissions'

import { protectedProcedure, router } from '~/server/trpc'

export const permissionsRouter = router({
  getFollowupPermissions: protectedProcedure
    .input(getFollowupPermissions.inputValidation)
    .query(getFollowupPermissions.execute),
  getHelpRequestPermissions: protectedProcedure
    .input(getHelpRequestPermissions.inputValidation)
    .query(getHelpRequestPermissions.execute)
})
