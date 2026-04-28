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
    updateBeneficiaryDevicesSchema
  } from '~/server/schema'
  import { routes } from '~/utils/routes'

  const combinedSchema = updateBeneficiaryExternalOrganisationsSchema.merge(
    updateBeneficiaryDevicesSchema.omit({ id: true })
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
      devices: (externalOrganisations?.devices ?? []).map(d => ({
        id: d.id,
        name: d.deviceName.name,
        startDate: d.startDate,
        endDate: d.endDate,
        partnerOrganisationName: d.partnerOrganisationName,
        precisions: d.precisions
      }))
    }
  })

  const router = trpcClient.beneficiary
  const {
    mutate: mutateExternalOrganisations,
    error,
    status
  } = router.updateExternalOrganisations.useMutation()
  const { mutate: mutateDevices, error: devicesError } =
    router.updateDevices.useMutation()

  async function onSaveBeneficiary(
    values: CombinedInput,
    target: string | undefined
  ) {
    if (!beneficiary.value) {
      return
    }

    const { devices, ...externalOrganisations } = values

    const [updatedExternal, updatedDevices] = await Promise.all([
      mutateExternalOrganisations(externalOrganisations),
      mutateDevices({ id: externalOrganisations.id, devices })
    ])

    if (
      error.value ||
      devicesError.value ||
      !updatedExternal ||
      !updatedDevices
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
