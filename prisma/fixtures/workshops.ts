import {
  AgeLimitCondition,
  Prisma,
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
  fixturesBeneficiaries
} from '.'
import dayjs from 'dayjs'
import { toFirstLetterUpperCase } from '../../utils/toFirstLetterUpperCase'

const WORKSHOP_COUNT = 100
const WORKSHOP_NAME_COUNT = 30

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
  Math.random() > 0.7 ? `${el} & ${el} & ${el} & ${el} & ${el}` : el

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
      attendeeLimit: faker.number.int({ min: 5, max: 40 }),
      ageLimit: faker.number.int({ min: 15, max: 70 }),
      ageLimitCondition: AgeLimitCondition.GreaterThan
    }
  }) satisfies Prisma.WorkshopCreateManyInput[]

function randomAttendance(workshopDate: Date) {
  if (dayjs(workshopDate).isAfter(dayjs(new Date()))) {
    return undefined
  }
  switch (faker.number.int({ min: 0, max: 3 })) {
    case 0:
      return WorkshopAttendeeAttendance.Excused
    case 1:
      return WorkshopAttendeeAttendance.NoShow
    case 2:
      return WorkshopAttendeeAttendance.Seen
    default:
      return undefined
  }
}

export const fixturesWorkshopAttendees = fixturesWorkshops
  .map(workshop => {
    const nAttendees = faker.number.int({
      min: 0,
      max: fixturesBeneficiaries.length - 1
    })
    const beneficiaries = fixturesBeneficiaries.filter(
      b => b.structureId === structureId
    )

    return new Array(nAttendees).fill(null).map(() => ({
      id: faker.string.uuid(),
      workshopId: workshop.id,
      type: WorkshopAttendeeType.Beneficiary,
      listType: WorkshopAttendeeListType.Main,
      comment: makeLong(faker.lorem.words(6)),
      attendance: randomAttendance(workshop.date),
      beneficiaryId: beneficiaries.pop()?.id
    }))
  })
  .flat() satisfies Prisma.WorkshopAttendeeCreateManyInput[]
