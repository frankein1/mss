import { defineStore } from 'pinia'
import type {
  BeneficiaryFilterInput,
  FollowupFilterInput,
  HelpRequestHistoryFilterInput,
  BeneficiaryHistoryFilterInput
} from '~/server/schema'

export const useFiltersStore = defineStore({
  id: 'filters',

  state: () => ({
    followup: null as FollowupFilterInput | null,
    helpRequestHistory: null as HelpRequestHistoryFilterInput | null,
    beneficiaryHistory: null as BeneficiaryHistoryFilterInput | null,
    beneficiary: null as BeneficiaryFilterInput | null
  })
})
