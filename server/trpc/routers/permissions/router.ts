import {
  getFollowupPermissions
} from '~/server/route/permissions'

import { protectedProcedure, router } from '~/server/trpc'

export const permissionsRouter = router({
  getFollowupPermissions: protectedProcedure
    .input(getFollowupPermissions.inputValidation)
    .query(getFollowupPermissions.execute)
})
