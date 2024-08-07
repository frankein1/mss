export const useBeneficiaryDetails = async (beneficiaryId: string) => {
  const trpcClient = useTrpcClient()

  const { data, pending, error } =
    await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const beneficiary = computed(() => data.value?.beneficiary || null)
  const draft = computed(() =>
    beneficiary.value ? beneficiary.value.draft : true
  )
  const permissions = computed(() => data.value?.permissions)

  const beneficiaryIdentification = computed(() =>
    beneficiary.value
      ? {
          id: beneficiary.value.id,
          firstName: beneficiary.value.general.firstName,
          birthName: beneficiary.value.general.birthName,
          usualName: beneficiary.value.general.usualName,
          birthDate: beneficiary.value.general.birthDate
        }
      : null
  )

  const familyIdentification = computed(
    () => data.value?.familyFileMinimalInfo?.beneficiaries || []
  )

  return {
    beneficiary,
    draft,
    permissions,
    beneficiaryIdentification,
    familyIdentification,
    pending,
    error
  }
}
