<template>
  <BeneficiaryEditFormLayout
    :family-file-id="beneficiary?.familyFileId || ''"
    :family-identification="familyIdentification"
    :beneficiary-identification="beneficiaryIdentification"
    :binded-values="bindedValues"
    :schema="updateBeneficiaryTaxHouseholdSchema"
    :permissions="permissions"
    :is-submitting="status === 'pending'"
    :current-route="routes.beneficiary.AppBeneficiaryEditTaxHousehold.name"
    :has-required-fields="false"
    :small-title="true"
    :title-icon="getFormIcon(familyIdentification.length)"
    @save="onSaveBeneficiary"
  >
    <AtomLazyComponent
      :pending
      :error="Boolean(errorFetch)"
      message="Les informations du bénéficiaire n'ont pas pu être chargées."
    >
      <BeneficiaryFormFamilySituation
        v-if="bindedValues"
        :family-identification="familyIdentification"
      />
    </AtomLazyComponent>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import type { UpdateBeneficiaryTaxHouseholdInput } from '~/server/schema'
  import { updateBeneficiaryTaxHouseholdSchema } from '~/server/schema'
  import { routes } from '~/utils/routes'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const {
    beneficiary,
    permissions,
    beneficiaryIdentification,
    familyIdentification,
    pending,
    error: errorFetch
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

  const router = trpcClient.beneficiary
  const { mutate, error, status } = router.updateTaxHousehold.useMutation()

  async function onSaveBeneficiary(
    ben: UpdateBeneficiaryTaxHouseholdInput,
    target: string | undefined
  ) {
    if (!beneficiary.value) {
      return
    }

    const updated = await mutate(ben)

    if (error.value || !updated) {
      snackbar.error(
        'La mise à jour de la fiche bénéficiaire a échoué.',
        snackbar.focus('.actions-bar', "button[type='submit']" as FocusHTMLTag)
      )
      return
    }

    navigateTo(target)
  }

  definePageMeta({
    layout: 'second-navigation'
  })
</script>
