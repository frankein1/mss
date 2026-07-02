<template>
  <BeneficiaryEditFormLayout
    :family-file-id="beneficiary?.familyFileId || ''"
    :family-identification="familyIdentification"
    :beneficiary-identification="beneficiaryIdentification"
    :binded-values="bindedValues"
    :permissions="permissions"
    :schema="updateBeneficiaryExternalOrganisationsSchema"
    :is-submitting="status === 'pending'"
    :current-route="
      routes.beneficiary.AppBeneficiaryEditExternalOrganisations.name
    "
    :small-title="true"
    :title-icon="getFormIcon(familyIdentification.length)"
    @save="onSaveBeneficiary"
  >
    <AtomLazyComponent
      :pending
      :error="Boolean(errorFetch)"
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

    const { id, structureId, externalOrganisations } = beneficiary.value

    return {
      id,
      structureId,
      ...externalOrganisations,
      supportPrograms: (externalOrganisations?.supportPrograms ?? []).map(
        d => ({
          id: d.id,
          supportProgramNameId: d.supportProgramName.id,
          startDate: d.startDate,
          endDate: d.endDate,
          partnerOrganisationId: d.partnerOrganisation?.id ?? null,
          precisions: d.precisions,
          exitReason: d.exitReason
        })
      )
    }
  })

  const router = trpcClient.beneficiary
  const { mutate, error, status } =
    router.updateExternalOrganisations.useMutation()

  async function onSaveBeneficiary(
    ben: UpdateBeneficiaryExternalOrganisationsInput,
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
