export const useFamilyFileMinimalInfo = async (familyFileId: string) => {
  const trpcClient = useTrpcClient()

  const {
    data: familyFile,
    pending,
    error
  } = await trpcClient.file.getFamilyFileMinimalInfo.useQuery({
    id: familyFileId
  })

  const familyFileIdentification = computed(() =>
    familyFile.value && familyFile.value.beneficiaries
      ? familyFile.value.beneficiaries
      : null
  )

  return {
    familyFileIdentification,
    pending,
    error
  }
}
