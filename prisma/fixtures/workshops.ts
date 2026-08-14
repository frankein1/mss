import type { Prisma } from '@prisma/client'
import {
  AgeLimitCondition,
  Gender,
  WorkshopAttendeeAttendance,
  WorkshopAttendeeListType,
  WorkshopAttendeeType
} from '@prisma/client'
import { fakerFR as faker } from '@faker-js/faker'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesPartnerOrganizations,
  fixturesUsers,
  FixtureUserRole,
  fixturesBeneficiaries,
  FixtureBeneficiary
} from '../fixtures'
import dayjs from 'dayjs'
import { toFirstLetterUpperCase } from '../../app/utils/toFirstLetterUpperCase'
import { equiRandomEnum } from './utils'

const WORKSHOP_COUNT = 100
const WORKSHOP_NAME_COUNT = 30
const MAKE_LONG = false

// Exclude M. Inactif ans S. Tesson as they must be inactive beneficiaries
const filteredFixtureBeneficiaries = fixturesBeneficiaries.filter(
  b =>
    b.id !== fixturesBeneficiaries[FixtureBeneficiary.INACTIVE].id &&
    b.id !== fixturesBeneficiaries[FixtureBeneficiary.TESSON].id
)

const structureId = fixtureStructures[FixtureStructure.Test].id
const createdById =
  fixturesUsers[
    Math.random() > 0.5
      ? FixtureUserRole.StructureManager
      : FixtureUserRole.ReceptionAgent
  ].id

faker.seed(4321)

/** 30% of the time make a long string to test UI rendering of strings */

const makeLong = (el: string) =>
  MAKE_LONG
    ? Math.random() > 0.7
      ? `${el} & ${el} & ${el} & ${el} & ${el}`
      : el
    : el

export const fixturesWorkshopNames = new Array(WORKSHOP_NAME_COUNT)
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    structureId,
    name: makeLong(toFirstLetterUpperCase(faker.company.buzzPhrase())),
    createdById
  })) satisfies Prisma.WorkshopNameCreateManyInput[]

export const fixturesWorkshops = new Array(WORKSHOP_COUNT)
  .fill(null)
  .map(() => {
    // Make random workshop duration between 30min and 3h
    const anytime = dayjs(faker.date.anytime()).set(
      'minute',
      faker.number.int({ min: 0, max: 45, multipleOf: 15 })
    )
    const duration = faker.number.int({ min: 30, max: 180, multipleOf: 15 })
    const hasStartTime = Math.random() > 0.5
    const startTime = hasStartTime ? anytime.format('HH:mm') : undefined
    const endTime =
      hasStartTime && Math.random() > 0.5
        ? anytime.add(duration, 'minute').format('HH:mm')
        : undefined

    // Choose random workshop name from list
    const nameIndex = faker.number.int({
      min: 0,
      max: WORKSHOP_NAME_COUNT - 1
    })

    // Choose random partner organisation from list
    const partners = fixturesPartnerOrganizations.filter(
      b => b.structureId === structureId
    )
    const partnerIndex = Math.floor(Math.random() * partners.length)

    if (!partners[partnerIndex] || !fixturesWorkshopNames[nameIndex]) {
      throw new Error('workshop: wrong index')
    }

    return {
      id: faker.string.uuid(),
      structureId,
      createdById,
      startTime,
      endTime,
      partnerOrganizationId:
        Math.random() > 0.5 ? partners[partnerIndex].id : undefined,
      workshopNameId: fixturesWorkshopNames[nameIndex].id,
      date: faker.date.between({ from: '2022-01-01', to: '2030-12-31' }),
      location: faker.location.street(),
      host: faker.person.fullName(),
      sessionName: makeLong(faker.lorem.words(6)),
      description: makeLong(faker.lorem.paragraphs()),
      attendeeLimit:
        Math.random() > 0.5 ? faker.number.int({ min: 5, max: 20 }) : undefined,
      ageLimit: faker.number.int({ min: 15, max: 70 }),
      ageLimitCondition: AgeLimitCondition.GreaterThan
    }
  }) satisfies Prisma.WorkshopCreateManyInput[]

function randomAttendance(workshopDate: Date) {
  if (dayjs(workshopDate).isAfter(dayjs(new Date()))) {
    return undefined
  }
  return equiRandomEnum([
    WorkshopAttendeeAttendance.Excused,
    WorkshopAttendeeAttendance.NoShow,
    WorkshopAttendeeAttendance.Seen,
    undefined
  ])
}

function getListType(index: number, attendeeLimit: number | undefined) {
  if (attendeeLimit) {
    return index < attendeeLimit
      ? WorkshopAttendeeListType.Main
      : WorkshopAttendeeListType.Waiting
  }
  return WorkshopAttendeeListType.Main
}

export const fixturesWorkshopAttendees = fixturesWorkshops
  .map(workshop => {
    const nAttendees = faker.number.int({ min: 0, max: 25 })
    const beneficiaries = filteredFixtureBeneficiaries.filter(
      b => b.structureId === structureId
    )

    return new Array(nAttendees).fill(null).map((_, index) => {
      const listType = getListType(index, workshop.attendeeLimit)
      const benid = beneficiaries.pop()?.id
      const type = benid
        ? equiRandomEnum([
            WorkshopAttendeeType.Beneficiary,
            WorkshopAttendeeType.External
          ])
        : WorkshopAttendeeType.External
      const beneficiaryId =
        type === WorkshopAttendeeType.Beneficiary ? benid : undefined
      const workshopExternalAttendeeId =
        type === WorkshopAttendeeType.External ? faker.string.uuid() : undefined
      return {
        id: faker.string.uuid(),
        workshopId: workshop.id,
        type,
        listType,
        comment: makeLong(faker.lorem.words(6)),
        attendance: randomAttendance(workshop.date),
        beneficiaryId,
        workshopExternalAttendeeId
      }
    })
  })
  .flat() satisfies Prisma.WorkshopAttendeeCreateManyInput[]

export const fixturesWorkshopExternalAttendees = fixturesWorkshopAttendees
  .filter(a => a.type === WorkshopAttendeeType.External)
  .map(attendee => ({
    id: attendee.workshopExternalAttendeeId,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    gender: equiRandomEnum([
      Gender.Male,
      Gender.Female,
      Gender.Other,
      undefined
    ]),
    birthDate: faker.date.birthdate(),
    city: faker.location.city()
  })) satisfies Prisma.WorkshopExternalAttendeeCreateManyInput[]
