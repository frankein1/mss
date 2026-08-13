export const useBeneficiaryDetails = async (
  beneficiaryId: MaybeRefOrGetter<string>,
  options?: { accommodation?: boolean }
) => {
  const trpcClient = useTrpcClient()
  const idRef = toRef(beneficiaryId)

  const queryInput = computed(() => ({
    id: idRef.value,
    options: options ? { accommodation: options.accommodation } : undefined
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

  const membersAccommodation = computed(
    () => data.value?.membersAccommodation || []
  )

  return {
    beneficiary,
    permissions,
    beneficiaryIdentification,
    familyIdentification,
    membersAccommodation,
    pending,
    error
  }
}
