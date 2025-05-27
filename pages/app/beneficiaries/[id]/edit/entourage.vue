<template>
  <BeneficiaryEditFormLayout
    :family-file-id="beneficiary?.familyFileId || ''"
    :family-identification="familyIdentification"
    :beneficiary-identification="beneficiaryIdentification"
    :binded-values="bindedValues"
    :schema="updateBeneficiaryEntourageSchema"
    :is-submitting="isSubmitting"
    :permissions="permissions"
    :current-route="routes.beneficiary.AppBeneficiaryEditEntourage.name"
    :small-title="true"
    :title-icon="getFormIcon(familyIdentification.length)"
    @save="onSaveBeneficiary"
  >
    <AtomLazyComponent
      :pending
      :error="Boolean(error)"
      message="Les informations du bénéficiaires n'ont pas pu être chargées."
    >
      <BeneficiaryFormEntourages v-if="bindedValues" />
    </AtomLazyComponent>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    updateBeneficiaryEntourageSchema,
    UpdateBeneficiaryEntourageInput
  } from '~/server/schema'
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

    const { id, structureId, entourages } = beneficiary.value

    return {
      id,
      structureId,
      entourages
    }
  })

  function onSaveBeneficiary(
    ben: UpdateBeneficiaryEntourageInput,
    target: string | undefined
  ) {
    if (!beneficiary.value) {
      return
    }

    const router = trpcClient.beneficiary
    const updateBeneficiary = router.updateEntourage.useMutation()
    const errMessage = 'La mise à jour de la fiche bénéficaire a échoué.'
    const focusfn = snackbar.focus(
      '.actions-bar',
      "button[type='submit']" as FocusHTMLTag
    )

    useTrpcMutation({
      mutation: () => updateBeneficiary.mutate(ben),
      isSubmitting,
      onSuccess: () => {
        if (updateBeneficiary.error.value) {
          snackbar.error(errMessage, focusfn)
          return
        }

        const fileRoute = routes.file.AppFile.path(
          beneficiary.value?.familyFileId || '',
          { beneficiaryId: beneficiary.value?.id }
        )
        navigateTo(target || fileRoute)
      },
      onFailure: () => {
        snackbar.error(errMessage, focusfn)
      }
    })
  }

  definePageMeta({
    layout: 'second-navigation'
  })
</script>
