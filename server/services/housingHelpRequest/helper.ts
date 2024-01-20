import { Prisma, SocialSupportStatus, AskedHousing } from '@prisma/client'
import {
  CreateHousingHelpRequestInput,
  HelpRequestFilterInput
} from '~/server/schema'

export const cleanCreateInput = cleanInput

export function prepareFilters(filters: HelpRequestFilterInput) {
  const formattedFilters: Prisma.HousingHelpRequestWhereInput = {}
  formattedFilters.socialSupport = {}

  if (filters.status) {
    formattedFilters.socialSupport.status = filters.status
  }

  if (filters.followupTypes) {
    formattedFilters.socialSupport.types = {
      some: { id: { in: filters.followupTypes } }
    }
  }

  if (filters.examinationDate) {
    formattedFilters.examinationDate = filters.examinationDate
  }

  if (filters.externalStructure !== undefined) {
    formattedFilters.externalStructure = filters.externalStructure === 'true'
  }

  if (filters.referents) {
    formattedFilters.socialSupport = {
      beneficiary: {
        referents: { some: { id: { in: filters.referents } } }
      }
    }
  }

  if (filters.ministre) {
    formattedFilters.socialSupport = { ministre: { in: filters.ministre } }
  }

  return formattedFilters
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
    decisionDate: isAccepted || isRefused ? decisionDate : null,
    refusalReason: isRefused ? refusalReason : null,
    dispatchDate: isExternalStructure ? dispatchDate : null,
    examinationDate: !isExternalStructure ? examinationDate : null,
    isFirst: isFirst === 'true',
    askedHousing
  }
}
