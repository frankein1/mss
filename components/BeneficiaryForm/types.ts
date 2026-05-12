import type { RouterOutput } from '~/server/trpc/routers'

type MembersAccommodation = NonNullable<
  RouterOutput['beneficiary']['getBeneficiaryDetails']['membersAccommodation']
>

export type MemberAccommodation = MembersAccommodation[number]
