import type { RouterOutput } from '~/server/trpc/routers'

export type MembersAccommodation = NonNullable<
  RouterOutput['beneficiary']['getBeneficiaryDetails']['membersAccommodation']
>
export type MemberAccommodation = MembersAccommodation[number]

export type DataEducationSchool =
  RouterOutput['dataEducation']['searchSchools'][0]

export type DataEducationSchoolCity =
  RouterOutput['dataEducation']['searchSchoolCities'][0]
