import { protectedProcedure, router } from '~/server/trpc'
import {
  getNotificationsQuery,
  updateNotificationMutation
} from '~/server/route/notification'

export const notificationRouter = router({
  get: protectedProcedure
    .input(getNotificationsQuery.inputValidation)
    .query(getNotificationsQuery.execute),
  update: protectedProcedure
    .input(updateNotificationMutation.inputValidation)
    .mutation(updateNotificationMutation.execute)
})
