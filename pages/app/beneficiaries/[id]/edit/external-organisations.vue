<template>
  <BeneficiaryEditFormLayout
    :family-file-id="beneficiary?.familyFileId || ''"
    :family-identification="familyIdentification"
    :beneficiary-identification="beneficiaryIdentification"
    :binded-values="bindedValues"
    :permissions="permissions"
    :schema="updateBeneficiaryExternalOrganisationsSchema"
    :is-submitting="isSubmitting"
    :current-route="
      routes.beneficiary.AppBeneficiaryEditExternalOrganisations.name
    "
    :small-title="true"
    :title-icon="getFormIcon(familyIdentification.length)"
    @save="onSaveBeneficiary"
  >
    <AtomLazyComponent
      :pending
      :error="Boolean(error)"
      message="Les informations du bénéficiaires n'ont pas pu être chargées."
    >
      <BeneficiaryFormExternalOrganisations v-if="bindedValues" />
    </AtomLazyComponent>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import type { UpdateBeneficiaryExternalOrganisationsInput } from '~/server/schema'
  import { updateBeneficiaryExternalOrganisationsSchema } from '~/server/schema'
  import { routes } from '~/utils/routes'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const {
    beneficiary,
    permissions,
    beneficiaryIdentification,
    familyIdentification,
    pending,
    error
  } = await useBeneficiaryDetails(beneficiaryId)

  const bindedValues = computed(() => {
    if (!beneficiary.value) {
      return null
    }

    const { id, structureId, externalOrganisations } = beneficiary.value

    return {
      id,
      structureId,
      ...externalOrganisations
    }
  })

  function onSaveBeneficiary(
    ben: UpdateBeneficiaryExternalOrganisationsInput,
    target: string | undefined
  ) {
    if (!beneficiary.value) {
      return
    }

    const router = trpcClient.beneficiary
    const updateBeneficiary = router.updateExternalOrganisations.useMutation()
    const errMessage = 'La mise à jour de la fiche bénéficaire a échoué.'

    useTrpcMutation({
      mutation: () => updateBeneficiary.mutate(ben),
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

  definePageMeta({
    layout: 'second-navigation'
  })
</script>
