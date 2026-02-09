import type {
  Beneficiary,
  Prisma,
  WorkshopAttendee,
  WorkshopExternalAttendee
} from '~/prisma/generated/client'
import {
  BeneficiaryTitle,
  Gender,
  WorkshopAttendeeListType,
  WorkshopAttendeeType
} from '~/prisma/generated/client'
import dayjs from 'dayjs'
import type { WorkshopFilterInput } from '~/server/schema'
import { WorkshopPeriodFilter } from '~/types/workshop'
import { FilterWorkshopTimeDirection } from '~/utils/constants/filters'

const getGenderFromTitle = (title: BeneficiaryTitle | null | undefined) => {
  if (!title) {
    return null
  }
  if (title === BeneficiaryTitle.Miss) {
    return Gender.Female
  }
  if (title === BeneficiaryTitle.Mister) {
    return Gender.Male
  }
  return Gender.Other
}

export function getListType(nAttendeees: number, attendeeLimit: number | null) {
  return attendeeLimit !== null && nAttendeees >= attendeeLimit
    ? WorkshopAttendeeListType.Waiting
    : WorkshopAttendeeListType.Main
}

export function addCountToWorkshop<
  T extends {
    attendeeLimit: number | null
    workshopAttendees: {
      listType: WorkshopAttendee['listType']
    }[]
    _count: {
      workshopAttendees: number
    }
  }
>(w: T) {
  const mainAttendees = w.workshopAttendees.filter(
    a => a.listType === WorkshopAttendeeListType.Main
  ).length
  const waitingAttendeees = Math.max(
    0,
    w._count.workshopAttendees - mainAttendees
  )

  return {
    ...w,
    isFull: w.attendeeLimit !== null && mainAttendees >= w.attendeeLimit,
    _count: {
      ...w._count,
      mainAttendees,
      waitingAttendeees
    }
  }
}

interface AttendeeBeneficiary
  extends Omit<WorkshopAttendee, 'workshopExternalAttendeeId'> {
  type: typeof WorkshopAttendeeType.Beneficiary
  id: string
  gender: Gender | null
  lastName: string | null
  firstName: string | null
  birthDate: Date | null
  email: string | null
  street: string | null
  zipcode: string | null
  city: string | null
  phone: string | null
}

interface AttendeeExternal extends Omit<WorkshopAttendee, 'beneficiaryId'> {
  type: typeof WorkshopAttendeeType.External
  id: string
  gender: Gender | null
  lastName: string | null
  firstName: string | null
  birthDate: Date | null
  email: string | null
  city: string | null
  phone: string | null
}

export function formatWorkshopAttendees(
  workshopAttendees: (WorkshopAttendee & {
    beneficiary: Pick<
      Beneficiary,
      | 'birthDate'
      | 'birthName'
      | 'firstName'
      | 'usualName'
      | 'title'
      | 'street'
      | 'city'
      | 'zipcode'
      | 'phone1'
      | 'email'
    > | null
  } & {
    workshopExternalAttendee: Pick<
      WorkshopExternalAttendee,
      | 'birthDate'
      | 'firstName'
      | 'lastName'
      | 'gender'
      | 'phone'
      | 'email'
      | 'city'
      | 'isAnonymized'
    > | null
  })[]
) {
  return workshopAttendees.map(wa => {
    const { beneficiary, workshopExternalAttendee, type, ...attendee } = wa

    if (type === WorkshopAttendeeType.Beneficiary) {
      if (!beneficiary) {
        throw new Error('workshop: incompatible type')
      }

      const { usualName, birthName, phone1, title, ...beneficiaryInfo } =
        beneficiary
      const { workshopExternalAttendeeId, ...attendeeInfo } = attendee

      return {
        ...attendeeInfo,
        ...beneficiaryInfo,
        type,
        lastName: usualName || birthName,
        phone: phone1,
        gender: getGenderFromTitle(title)
      } satisfies AttendeeBeneficiary
    }

    if (type === WorkshopAttendeeType.External) {
      if (!workshopExternalAttendee) {
        throw new Error('workshop: incompatible type')
      }

      const { beneficiaryId, ...attendeeInfo } = attendee

      return {
        ...attendeeInfo,
        ...workshopExternalAttendee,
        type
      } satisfies AttendeeExternal
    }

    throw new Error('workshop: accompanying attendee not implemented')
  })
}

export function prepareWorkshopFilters(
  filters: WorkshopFilterInput,
  structureId: string
) {
  const workshopFilters: Prisma.WorkshopWhereInput = {
    structureId,
    ...getDateFilter(filters)
  }

  if (filters.workshopNameIds) {
    workshopFilters.workshopNameId = { in: filters.workshopNameIds }
  }

  return workshopFilters
}

function getStartDate(filter: WorkshopFilterInput) {
  const { timeDirection, fromDate, period } = filter
  const now = dayjs()
  const todayDate = new Date(now.format('YYYY-MM-DD'))
  if (timeDirection === FilterWorkshopTimeDirection.Future) {
    if (!fromDate) {
      return todayDate
    }
    // Get max(fromDate, today)
    return fromDate.getTime() > now.valueOf() ? fromDate : todayDate
  }
  switch (period) {
    case WorkshopPeriodFilter.ThisYear:
      return now.startOf('year').toDate()
    case WorkshopPeriodFilter.ThisMonth:
      return now.startOf('month').toDate()
    case WorkshopPeriodFilter.Custom:
      return fromDate
    default:
      return undefined
  }
}

function getEndDate(filter: WorkshopFilterInput) {
  const { period, timeDirection, toDate } = filter
  const now = dayjs()
  const todayDate = new Date(now.format('YYYY-MM-DD'))
  if (timeDirection === FilterWorkshopTimeDirection.Past) {
    if (!toDate) {
      return todayDate
    }
    // Get min(toDate, today)
    return toDate.getTime() < now.valueOf() ? toDate : todayDate
  }
  switch (period) {
    case WorkshopPeriodFilter.ThisYear:
      return now.endOf('year').toDate()
    case WorkshopPeriodFilter.ThisMonth:
      return now.endOf('month').toDate()
    case WorkshopPeriodFilter.Custom:
      return toDate
    default:
      return undefined
  }
}
const getDateFilter = (filter: WorkshopFilterInput) => {
  const { timeDirection } = filter
  const startDate = getStartDate(filter)
  const endDate = getEndDate(filter)
  const now = dayjs()
  const todayDate = new Date(now.format('YYYY-MM-DD'))
  const nowString = now.format('HH:mm')
  if (timeDirection === FilterWorkshopTimeDirection.Future) {
    if (startDate && startDate > todayDate) {
      // Don't worry about startTime
      return { date: { gte: startDate, lte: endDate } }
    }
    return {
      OR: [
        { date: { gt: todayDate, lte: endDate } },
        {
          // Handle startTime when the date is today
          date: { equals: todayDate },
          OR: [{ startTime: { gte: nowString } }, { startTime: null }]
        }
      ]
    }
  }
  if (timeDirection === FilterWorkshopTimeDirection.Past) {
    if (endDate && endDate < todayDate) {
      // Don't worry about startTime
      return { date: { gte: startDate, lte: endDate } }
    }
    return {
      OR: [
        { date: { gte: startDate, lt: todayDate } },
        {
          // Handle startTime when the date is today
          date: { equals: todayDate },
          startTime: { lt: nowString }
        }
      ]
    }
  }

  return { date: { gte: startDate, lte: endDate } }
}
