import type { RouterOutput } from '~~/server/trpc/routers'

type WorkshopPage = RouterOutput['workshop']['getPage']

export type WorkshopsPageItems = WorkshopPage['items']
export type WorkshopsPageItem = WorkshopsPageItems[0]
