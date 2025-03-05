import { protectedProcedure, router } from '~/server/trpc'
import {
  getArchiveNotificationsQuery,
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
export const archiveNotificationRouter = router({
  get: protectedProcedure
    .input(getArchiveNotificationsQuery.inputValidation)
    .query(getArchiveNotificationsQuery.execute)
})
