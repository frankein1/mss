import { protectedProcedure, router } from '~/server/trpc'
import {
  getNotificationQuery,
  updateNotificationMutation
} from '~/server/request/notification'

export const notificationRouter = router({
  get: protectedProcedure
    .input(getNotificationQuery.inputValidation)
    .query(getNotificationQuery.execute),
  update: protectedProcedure
    .input(updateNotificationMutation.inputValidation)
    .mutation(updateNotificationMutation.execute)
})
