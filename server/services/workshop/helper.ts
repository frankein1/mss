import {
  Beneficiary,
  BeneficiaryTitle,
  Gender,
  WorkshopAttendee,
  WorkshopAttendeeType,
  WorkshopExternalAttendee
} from '@prisma/client'

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
