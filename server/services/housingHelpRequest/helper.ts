import { SocialSupportStatus, AskedHousing } from '@prisma/client'
import { CreateHousingHelpRequestInput } from '~/server/schema'

export const cleanCreateInput = cleanInput
export const cleanUpdateInput = cleanInput

function cleanIsFirst(isFirst: CreateHousingHelpRequestInput['isFirst']) {
  if (isFirst === 'true') {
    return true
  }
  if (isFirst === 'false') {
    return false
  }
  return isFirst
}

function cleanInput(input: CreateHousingHelpRequestInput) {
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
    ...data
  } = input

  const isExternalStructure = externalStructure === 'true'
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
    decisionDate: isAccepted || isRefused ? decisionDate : null,
    refusalReason: isRefused ? refusalReason : null,
    dispatchDate: isExternalStructure ? dispatchDate : null,
    examinationDate: !isExternalStructure ? examinationDate : null,
    isFirst: cleanIsFirst(isFirst),
    askedHousing
  }
}
