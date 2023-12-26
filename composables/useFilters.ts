import {
  BeneficiaryFilterInput,
  FollowupFilterInput,
  HelpRequestFilterInput
} from '~/server/schema'

export function useFilters() {
  const followup = useState<FollowupFilterInput | undefined | null>(
    'filters:followup',
    () => undefined
  )
  const helpRequest = useState<HelpRequestFilterInput | undefined | null>(
    'filters:helpRequest',
    () => undefined
  )

  const beneficiary = useState<BeneficiaryFilterInput | undefined | null>(
    'filters:beneficiary',
    () => undefined
  )

  return {
    followup,
    helpRequest,
    beneficiary
  }
}
