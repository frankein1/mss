import { defineStore } from 'pinia'
import type {
  BeneficiaryFilterInput,
  FollowupFilterInput,
  HelpRequestFilterInput,
  BeneficiaryHistoryFilterInput
} from '~/server/schema'

export const useFiltersStore = defineStore({
  id: 'filters',

  state: () => ({
    followup: null as FollowupFilterInput | null,
    helpRequest: null as HelpRequestFilterInput | null,
    beneficiaryHistory: null as BeneficiaryHistoryFilterInput | null,
    beneficiary: null as BeneficiaryFilterInput | null
  })
})
