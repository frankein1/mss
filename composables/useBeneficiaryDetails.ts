export const useBeneficiaryDetails = async (
  beneficiaryId: MaybeRef<string>
) => {
  const trpcClient = useTrpcClient()
  const idRef = isRef(beneficiaryId) ? beneficiaryId : ref(beneficiaryId)

  // Make sure the query input is reactive, so that useQuery
  // is run in watch mode (refetch when the input changes)
  const queryInput = computed(() => ({
    id: idRef.value
  }))

  const { data, pending, error } =
    await trpcClient.beneficiary.getBeneficiaryDetails.useQuery(queryInput)

  const beneficiary = computed(() => data.value?.beneficiary || null)

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
    permissions,
    beneficiaryIdentification,
    familyIdentification,
    pending,
    error
  }
}
