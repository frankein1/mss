import { RouterOutput } from '~/server/trpc/routers'

type GetNotificationOutput = RouterOutput['notification']['get']

export type NotificationItem = GetNotificationOutput[number]['notification']
