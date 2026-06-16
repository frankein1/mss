<template>
  <BeneficiaryEditFormLayout
    :family-file-id="beneficiary?.familyFileId || ''"
    :family-identification="familyIdentification"
    :beneficiary-identification="beneficiaryIdentification"
    :binded-values="bindedValues"
    :permissions="permissions"
    :schema="combinedSchema"
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
  import type { z } from 'zod'
  import {
    updateBeneficiaryExternalOrganisationsSchema,
    updateSupportProgramsSchema
  } from '~/server/schema'
  import { routes } from '~/utils/routes'

  // TODO: supprimer combinedSchema et CombinedInput
  // et résoudre le schema dans server/schema/beneficiary/updateBeneficiary.schema.ts
  // lorsque les mutations seront mergée en une seule (mutateExternalOrganisations)
  const combinedSchema = updateBeneficiaryExternalOrganisationsSchema.merge(
    updateSupportProgramsSchema.omit({ id: true })
  )
  type CombinedInput = z.infer<typeof combinedSchema>

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
          name: d.supportProgramName.name,
          startDate: d.startDate,
          endDate: d.endDate,
          partnerOrganisationId: d.partnerOrganisation?.id ?? null,
          precisions: d.precisions,
          exitReason: d.exitReason
        })
      )
    }
  })

  const {
    mutate: mutateExternalOrganisations,
    error,
    status
  } = trpcClient.beneficiary.updateExternalOrganisations.useMutation()
  const { mutate: mutateSupportPrograms, error: supportProgramsError } =
    trpcClient.supportProgram.update.useMutation()

  async function onSaveBeneficiary(
    values: CombinedInput,
    target: string | undefined
  ) {
    if (!beneficiary.value) {
      return
    }

    const { supportPrograms, ...externalOrganisations } = values

    const [updatedExternal, updatedSupportPrograms] = await Promise.all([
      mutateExternalOrganisations(externalOrganisations),
      mutateSupportPrograms({
        id: externalOrganisations.id,
        supportPrograms
      })
    ])

    if (
      error.value ||
      supportProgramsError.value ||
      !updatedExternal ||
      !updatedSupportPrograms
    ) {
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
