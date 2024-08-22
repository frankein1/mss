<template>
  <BeneficiaryEditFormLayout
    :draft
    :family-file-id="beneficiary?.familyFileId || ''"
    :family-identification="familyIdentification"
    :beneficiary-identification="beneficiaryIdentification"
    :schema="updateBeneficiaryOccupationSchema"
    :binded-values="bindedValues"
    :permissions="permissions"
    :is-submitting="isSubmitting"
    :current-route="routes.beneficiary.AppBeneficiaryEditOccupation.name"
    :small-title="true"
    :title-icon="getFormIcon(familyIdentification.length)"
    @save="onSaveBeneficiary"
  >
    <AtomLazyComponent
      :pending
      :error="Boolean(error)"
      message="Les informations du bénéficiaires n'ont pas pu être chargées."
    >
      <BeneficiaryFormOccupationIncome v-if="bindedValues && permissions" />
    </AtomLazyComponent>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    updateBeneficiaryOccupationSchema,
    UpdateBeneficiaryOccupationInput
  } from '~/server/schema'
  import { routes } from '~/utils/routes'

  definePageMeta({
    name: routes.beneficiary.AppBeneficiaryEditOccupation.name
  })

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const {
    beneficiary,
    permissions,
    draft,
    beneficiaryIdentification,
    familyIdentification,
    pending,
    error
  } = await useBeneficiaryDetails(beneficiaryId)

  const bindedValues = computed(() => {
    if (!beneficiary.value) {
      return null
    }

    const { id, structureId, occupationIncome } = beneficiary.value

    return {
      id,
      structureId,
      ...occupationIncome,
      pensionOrganisations: occupationIncome?.pensionOrganisations || []
    }
  })

  function onSaveBeneficiary(
    ben: UpdateBeneficiaryOccupationInput,
    target: string | undefined,
    validate: boolean
  ) {
    if (!beneficiary.value) {
      return
    }

    const router = trpcClient.beneficiary
    const validateBeneficiary = router.validate.useMutation()
    const updateBeneficiary = router.updateOccupationIncome.useMutation()
    const errMessage = 'La mise à jour de la fiche bénéficaire a échoué.'

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
        if (updateBeneficiary.error.value) {
          snackbar.error(errMessage, snackbar.focus('form', 'select'))
          return
        }

        const fileRoute = routes.file.AppFile.path(
          beneficiary.value?.familyFileId || '',
          { beneficiaryId: beneficiary.value?.id }
        )
        navigateTo(target || fileRoute)
      },
      onFailure: () => {
        snackbar.error(errMessage, snackbar.focus('form', 'select'))
      }
    })
  }
</script>
