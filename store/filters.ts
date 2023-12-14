import { defineStore } from 'pinia'
import type {
  BeneficiaryFilterInput,
  FollowupFilterInput,
  HelpRequestFilterInput
} from '~/server/schema'

export const useFiltersStore = defineStore({
  id: 'filters',

  state: () => ({
    followup: null as FollowupFilterInput | null,
    helpRequest: null as HelpRequestFilterInput | null,
    beneficiary: null as BeneficiaryFilterInput | null
  })
})
