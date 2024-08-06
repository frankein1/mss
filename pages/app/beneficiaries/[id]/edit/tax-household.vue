<template>
  <BeneficiaryEditFormLayout
    :draft
    :family-file-id="beneficiary?.familyFileId || ''"
    :beneficiary-identification="beneficiaryIdentification"
    :binded-values="bindedValues"
    :schema="updateBeneficiaryTaxHouseholdSchema"
    :permissions="permissions"
    :is-submitting="isSubmitting"
    :current-route="routes.beneficiary.AppBeneficiaryEditTaxHousehold.name"
    :has-required-fields="false"
    :small-title="true"
    title-icon="fr-icon-user-line"
    @save="onSaveBeneficiary"
  >
    <AtomLazyComponent
      :pending
      :error="Boolean(error)"
      message="Les informations du bénéficiaires n'ont pas pu être chargées."
    >
      <div
        v-if="bindedValues"
        class="fr-p-3v"
      >
        <h2 class="title-blue fr-mb-6v">{{ pageTitle }}</h2>
        <BeneficiaryFormFamilySituation />
      </div>
    </AtomLazyComponent>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    updateBeneficiaryTaxHouseholdSchema,
    UpdateBeneficiaryTaxHouseholdInput
  } from '~/server/schema'
  import { routes } from '~/utils/routes'

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const {
    beneficiary,
    permissions,
    draft,
    beneficiaryIdentification,
    pending,
    error
  } = await useBeneficiaryDetails(beneficiaryId)

  const bindedValues = computed(() => {
    if (!beneficiary.value) {
      return null
    }

    const { id, structureId, taxHouseholds } = beneficiary.value

    return {
      id,
      structureId,
      familySituation: taxHouseholds?.familySituation || null,
      minorChildren: taxHouseholds?.minorChildren || null,
      majorChildren: taxHouseholds?.majorChildren || null,
      caregiver: taxHouseholds?.caregiver || false,
      weddingDate: taxHouseholds?.weddingDate
        ? new Date(taxHouseholds.weddingDate)
        : undefined,
      divorceDate: taxHouseholds?.divorceDate
        ? new Date(taxHouseholds.divorceDate)
        : undefined
    }
  })

  function onSaveBeneficiary(
    ben: UpdateBeneficiaryTaxHouseholdInput,
    target: string | undefined,
    validate: boolean
  ) {
    if (!beneficiary.value) {
      return
    }
    const router = trpcClient.beneficiary
    const validateBeneficiary = router.validate.useMutation()
    const updateBeneficiary = router.updateTaxHousehold.useMutation()

    useTrpcMutation({
      mutation: () => {
        const mutations = []
        if (validate && draft.value) {
          mutations.push(validateBeneficiary.mutate({ id: beneficiaryId }))
        }
        mutations.push(updateBeneficiary.mutate(ben))
        return Promise.all(mutations)
      },
      isSubmitting,
      onSuccess: () => {
        const fileRoute = routes.file.AppFile.path(
          beneficiary.value?.familyFileId || '',
          { beneficiaryId: beneficiary.value?.id }
        )
        navigateTo(target || fileRoute)
      },
      onFailure: () => {
        useSnackbar().error('La mise à jour de la fiche bénéficiaire a échoué.')
      }
    })
  }

  const pageTitle = computed(
    () => routes.beneficiary.AppBeneficiaryEditTaxHousehold.title
  )
</script>
