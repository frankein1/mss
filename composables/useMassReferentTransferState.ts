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

  const totalBeneficiaries = useState<number | null>(
    'editReferents:totalBeneficiaries',
    () => null
  )

  const summarySelected = computed(() =>
    selectedBeneficiaries.value.length > 1
      ? `${selectedBeneficiaries.value.length} dossiers bénéficiaires sélectionnés sur un total de ${totalBeneficiaries.value || 0}.`
      : `${selectedBeneficiaries.value.length} dossier bénéficiaire sélectionné sur un total de ${totalBeneficiaries.value || 0}.`
  )

  return {
    selectedBeneficiaries,
    referentId,
    editionChoice,
    totalBeneficiaries,
    summarySelected
  }
}
