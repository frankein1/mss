import type { AskedHousing } from '@prisma/client'
import { SocialSupportStatus } from '@prisma/client'
import type { CreateHousingHelpRequestServerInput } from '~/server/schema'

export const cleanCreateInput = cleanInput
export const cleanUpdateInput = cleanInput

function cleanInput(input: CreateHousingHelpRequestServerInput) {
  const {
    status,
    refusalReason,
    dispatchDate,
    decisionDate,
    examinationDate,
    externalStructure,
    isFirst,
    HebergementTemporaire,
    ParcPrive,
    ParcSocial,
    instructorOrganizationId,
    instructorOrganizationContactId,
    ...data
  } = input

  const isExternalStructure = externalStructure
  const isAccepted = status === SocialSupportStatus.Accepted
  const isRefused = status === SocialSupportStatus.Refused

  const askedHousingFields = {
    HebergementTemporaire,
    ParcPrive,
    ParcSocial
  }
  const askedHousing = Object.entries(askedHousingFields)
    .filter(([_key, value]) => !!value)
    .map(([key, _value]) => key as AskedHousing)

  return {
    ...data,
    status,
    externalStructure: isExternalStructure,
    instructorOrganizationId: isExternalStructure
      ? instructorOrganizationId
      : null,
    instructorOrganizationContactId: instructorOrganizationId
      ? instructorOrganizationContactId
      : null,
    decisionDate: isAccepted || isRefused ? decisionDate : null,
    refusalReason: isRefused ? refusalReason : null,
    dispatchDate: isExternalStructure ? dispatchDate : null,
    examinationDate: !isExternalStructure ? examinationDate : null,
    isFirst,
    askedHousing
  }
}
