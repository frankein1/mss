export type EditionChoice = 'delete' | 'add'

export function useMassReferentTransferState() {
  const editionChoice = useState<EditionChoice | null>(
    'editReferents:editionChoice',
    () => null
  )

  const selectedBeneficiaries = useState<
    { beneficiaryId: string; familyFileId: string }[]
  >('editReferents:selectedBeneficiaries', () => [])

  const referentId = useState<string | null>(
    'editReferents:referentId',
    () => null
  )

  return { selectedBeneficiaries, referentId, editionChoice }
}
