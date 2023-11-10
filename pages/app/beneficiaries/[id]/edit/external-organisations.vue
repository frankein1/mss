<template>
  <BeneficiaryEditFormLayout
    v-if="permissions"
    :permissions="permissions"
    :schema="saveBeneficiaryExternalOrganisationsSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :current-route="Route.AppBeneficiaryEditExternalOrganisations"
    @save="onSaveBeneficiary"
  >
    <AtomAlert
      v-if="error"
      class="fr-mb-2w"
      :alert-type="AlertType.Error"
      message="Les informations du bénéficiaires n'ont pas pu être chargées."
    />
    <AtomLoader
      v-else-if="pending"
      class="fr-mx-auto"
    />
    <div
      v-else-if="beneficiary"
      class="fr-p-3v"
    >
      <BeneficiaryFormExternalOrganisations />
    </div>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryExternalOrganisationsSchema,
    SaveBeneficiaryExternalOrganisationsInput
  } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, Route } from '~/utils/routing'
  import type { MinimalBeneficiaryForFormLayout } from '~/types/beneficiary'

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const { data, pending, error } =
    await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const permissions = computed(() => {
    if (!data.value) {
      return null
    }
    return data.value.permissions
  })

  const beneficiary = computed(() => {
    if (!data.value) {
      return null
    }

    const {
      beneficiary: { id, meta, general, externalOrganisations }
    } = data.value

    // Names and id are required for building the breadcrumb in the layout
    return {
      id,
      structureId: meta.structureId,
      referents: meta.referents,
      firstName: general.firstName,
      usualName: general.usualName,
      birthName: general.birthName,
      protectionMeasure: externalOrganisations?.protectionMeasure,
      representative: externalOrganisations?.representative,
      prescribingStructure: externalOrganisations?.prescribingStructure,
      orientationType: externalOrganisations?.orientationType,
      orientationStructure: externalOrganisations?.orientationStructure,
      serviceProviders: externalOrganisations?.serviceProviders,
      involvedPartners: externalOrganisations?.involvedPartners
    } as SaveBeneficiaryExternalOrganisationsInput &
      MinimalBeneficiaryForFormLayout
  })

  function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryExternalOrganisationsInput,
    target: string | undefined
  ) {
    if (!data.value) {
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.updateExternalOrganisations.mutate({
          id: beneficiaryId,
          ...beneficiary
        }),
      isSubmitting,
      onSuccess: () => {
        navigateTo(target || RoutePath.AppBeneficiary(beneficiaryId))
      },
      onFailure: () => {
        useSnackbar().error('La mise à jour de la fiche bénéficaire a échoué.')
      }
    })
  }
</script>
