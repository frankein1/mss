import { getOne, getOneWithAttendees } from '~/server/route/workshop/get.query'

export type WorkshopDetails = Awaited<ReturnType<typeof getOne>>
export type WorkshopWithAttendeesDetails = Awaited<
  ReturnType<typeof getOneWithAttendees>
>

export type WorkshopAttendee =
  WorkshopWithAttendeesDetails['workshopAttendees'][0]

export enum WorkshopPeriodFilter {
  ThisYear = 'ThisYear',
  ThisMonth = 'ThisMonth',
  Custom = 'Custom'
}
