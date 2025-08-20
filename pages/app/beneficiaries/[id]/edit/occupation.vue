<template>
  <BeneficiaryEditFormLayout
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
  import type { UpdateBeneficiaryOccupationInput } from '~/server/schema'
  import { updateBeneficiaryOccupationSchema } from '~/server/schema'
  import { routes } from '~/utils/routes'

  definePageMeta({
    name: routes.beneficiary.AppBeneficiaryEditOccupation.name,
    layout: 'second-navigation'
  })

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

    const { id, structureId, occupationIncome } = beneficiary.value

    return {
      id,
      structureId,
      ...occupationIncome,
      isSchoolInQPV: Boolean(occupationIncome?.isSchoolInQPV),
      pensionOrganisations: occupationIncome?.pensionOrganisations || []
    }
  })

  function onSaveBeneficiary(
    ben: UpdateBeneficiaryOccupationInput,
    target: string | undefined
  ) {
    if (!beneficiary.value) {
      return
    }

    const router = trpcClient.beneficiary
    const updateBeneficiary = router.updateOccupationIncome.useMutation()
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
</script>
