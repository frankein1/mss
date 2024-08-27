export const useFamilyFileMinimalInfo = async (familyFileId: string) => {
  const trpcClient = useTrpcClient()
  const route = useRoute()

  const {
    data: familyFile,
    pending,
    error,
    refresh
  } = await trpcClient.file.getFamilyFileMinimalInfo.useQuery({
    id: familyFileId
  })

  const familyFileIdentification = computed(() =>
    familyFile.value && familyFile.value.beneficiaries
      ? familyFile.value.beneficiaries
      : null
  )

  const getBeneficiaryIdOnPageLoad = () => {
    const queryBeneficiaryId = route.query.beneficiaryId as string

    const defaultBeneficiaryId =
      familyFileIdentification.value &&
      familyFileIdentification.value.length > 0
        ? familyFileIdentification.value[0].id
        : ''

    return queryBeneficiaryId || defaultBeneficiaryId
  }

  return {
    familyFileIdentification,
    pending,
    error,
    refreshFamilyFile: refresh,
    getBeneficiaryIdOnPageLoad
  }
}
