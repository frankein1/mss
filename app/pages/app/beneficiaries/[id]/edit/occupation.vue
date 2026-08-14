<template>
  <BeneficiaryEditFormLayout
    :family-file-id="beneficiary?.familyFileId || ''"
    :family-identification="familyIdentification"
    :beneficiary-identification="beneficiaryIdentification"
    :schema="updateBeneficiaryOccupationSchema"
    :binded-values="bindedValues"
    :permissions="permissions"
    :is-submitting="status === 'pending'"
    :current-route="routes.beneficiary.AppBeneficiaryEditOccupation.name"
    :small-title="true"
    :title-icon="getFormIcon(familyIdentification.length)"
    @save="onSaveBeneficiary"
  >
    <AtomLazyComponent
      :pending
      :error="Boolean(errorFetch)"
      message="Les informations du bénéficiaires n'ont pas pu être chargées."
    >
      <BeneficiaryFormOccupationIncome
        v-if="bindedValues && permissions"
        :initial-school="bindedValues.school"
      />
    </AtomLazyComponent>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import type {
    ActiveBeneficiarySocioProfessionalCategory,
    UpdateBeneficiaryOccupationInput
  } from '~~/server/schema'
  import { updateBeneficiaryOccupationSchema } from '~~/server/schema'
  import { routes } from '~/utils/routes'

  definePageMeta({
    name: routes.beneficiary.AppBeneficiaryEditOccupation.name,
    layout: 'second-navigation'
  })

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
    error: errorFetch,
    refresh
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
      socioProfessionalCategory: (occupationIncome?.socioProfessionalCategory ??
        null) as ActiveBeneficiarySocioProfessionalCategory | null,
      schoolUai: occupationIncome?.schoolUai ?? null,
      school: occupationIncome?.school ?? null,
      schoolPrograms: occupationIncome?.schoolPrograms || [],
      pensionOrganisations: occupationIncome?.pensionOrganisations || [],
      activityStatus: occupationIncome?.activityStatus || []
    }
  })

  const router = trpcClient.beneficiary
  const { mutate, error, status } = router.updateOccupationIncome.useMutation()

  async function onSaveBeneficiary(
    ben: UpdateBeneficiaryOccupationInput,
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

    await refresh()
    navigateTo(target)
  }
</script>
