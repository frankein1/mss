export const useBeneficiaryMinimalInfo = async (beneficiaryId: string) => {
  const trpcClient = useTrpcClient()

  const {
    data: beneficiary,
    pending,
    error
  } = await trpcClient.beneficiary.getBeneficiaryMinimalInfo.useQuery({
    id: beneficiaryId
  })

  const beneficiaryIdentification = computed(() =>
    beneficiary.value
      ? {
          id: beneficiary.value.id,
          firstName: beneficiary.value.firstName,
          birthName: beneficiary.value.birthName,
          usualName: beneficiary.value.usualName,
          birthDate: beneficiary.value.birthDate
        }
      : null
  )

  return {
    beneficiaryIdentification,
    pending,
    error
  }
}
