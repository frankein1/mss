import {
  BeneficiaryFilterInput,
  FollowupFilterInput,
  FileInstructionFilterInput
} from '~/server/schema'

export function useFilters() {
  const followup = useState<FollowupFilterInput | undefined | null>(
    'filters:followup',
    () => undefined
  )
  const fileInstruction = useState<
    FileInstructionFilterInput | undefined | null
  >('filters:helpRequest', () => undefined)

  const beneficiary = useState<BeneficiaryFilterInput | undefined | null>(
    'filters:beneficiary',
    () => undefined
  )

  return {
    followup,
    fileInstruction,
    beneficiary
  }
}
