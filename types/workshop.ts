import { getOne } from '~/server/route/workshop/get.query'

export type WorkshopDetails = Awaited<ReturnType<typeof getOne>>
