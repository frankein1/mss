import { defineStore } from 'pinia'
import { BeneficiaryFilterRawInput } from '~/server/schema'

export const useFiltersStore = defineStore({
  id: 'filters',

  state: () => ({
    // TODO
    // interviewHistory: null as FilterState<> | null,
    // helpRequestHistory: null as FilterState<> | null,
    // beneficiaryHistory: null as FilterState<> | null,
    beneficiary: null as BeneficiaryFilterRawInput | null
  })
})
