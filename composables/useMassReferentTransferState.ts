export function useMassReferentTransferState() {
  const selectedBeneficiaries = useState<
    { beneficiaryId: string; familyFileId: string }[]
  >('editReferents:selectedBeneficiaries', () => [])

  const referentId = useState<string | null>(
    'editReferents:referentId',
    () => null
  )

  return { selectedBeneficiaries, referentId }
}
