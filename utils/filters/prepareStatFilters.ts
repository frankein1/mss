import { Prisma } from '@prisma/client'
import { StatFilterInput } from '~/server/schema'

function prepareDateFilters(filters: StatFilterInput) {
  return {
    ...(filters.fromDate && { gte: filters.fromDate }),
    ...(filters.toDate && { lte: filters.toDate })
  }
}

export function prepareBeneficiaryStatFilters(filters: StatFilterInput) {
  const socialSupportFilters: { [k: string]: {} } = {}

  if (filters.fromDate || filters.toDate) {
    socialSupportFilters.created = prepareDateFilters(filters)
  }

  if (filters.followupTypes) {
    const typesListFilter = {
      id: { in: filters.followupTypes }
    }
    socialSupportFilters.types = { some: typesListFilter }
  }

  const formattedFilters: Prisma.BeneficiaryWhereInput = {}

  if (filters.fromDate || filters.toDate || filters.followupTypes) {
    formattedFilters.socialSupports = socialSupportFilters
  }

  if (filters.cities) {
    formattedFilters.city = { in: filters.cities }
  }

  if (filters.referent) {
    formattedFilters.referents = { some: { id: { equals: filters.referent } } }
  }

  if (filters.beneficiaryStatus) {
    formattedFilters.status = filters.beneficiaryStatus
  }

  return formattedFilters
}

export function prepareHelpRequestStatFilters(filters: StatFilterInput) {
  const socialSupport: Prisma.SocialSupportWhereInput = {}

  if (filters.fromDate || filters.toDate) {
    socialSupport.created = prepareDateFilters(filters)
  }

  if (filters.followupTypes) {
    socialSupport.types = { some: { id: { in: filters.followupTypes } } }
  }

  if (filters.cities) {
    socialSupport.beneficiary = { city: { in: filters.cities } }
  }

  if (filters.referent) {
    socialSupport.createdBy = { id: filters.referent }
  }

  if (filters.beneficiaryStatus) {
    if (socialSupport.beneficiary) {
      socialSupport.beneficiary.status = filters.beneficiaryStatus
    } else {
      socialSupport.beneficiary = { status: filters.beneficiaryStatus }
    }
  }

  return {
    socialSupport
  }
}

export function prepareFollowupStatFilters(filters: StatFilterInput) {
  const socialSupport: Prisma.SocialSupportWhereInput = {}

  if (filters.fromDate || filters.toDate) {
    socialSupport.created = prepareDateFilters(filters)
  }

  if (filters.followupTypes) {
    socialSupport.types = { some: { id: { in: filters.followupTypes } } }
  }

  if (filters.cities) {
    socialSupport.beneficiary = { city: { in: filters.cities } }
  }

  if (filters.referent) {
    socialSupport.createdBy = { id: filters.referent }
  }

  if (filters.beneficiaryStatus) {
    if (socialSupport.beneficiary) {
      socialSupport.beneficiary.status = filters.beneficiaryStatus
    } else {
      socialSupport.beneficiary = { status: filters.beneficiaryStatus }
    }
  }

  return { socialSupport }
}
