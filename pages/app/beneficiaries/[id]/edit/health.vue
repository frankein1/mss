<template>
  <BeneficiaryEditFormLayout
    :schema="saveBeneficiaryHealthSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :current-route="Route.AppBeneficiaryEditHealth"
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
      <BeneficiaryFormHealth />
    </div>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryHealthSchema,
    SaveBeneficiaryHealthInput
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

  const beneficiary = computed(() => {
    if (!data.value) {
      return null
    }

    const { beneficiary: b } = data.value

    // Names and id are required for building the breadcrumb in the layout
    return {
      id: b.id,
      structureId: b.structureId,
      referents: b.referents,
      firstName: b.firstName,
      usualName: b.usualName,
      birthName: b.birthName,
      gir: b.gir,
      doctor: b.doctor,
      healthAdditionalInformation: b.healthAdditionalInformation,
      socialSecurityNumber: b.socialSecurityNumber,
      insurance: b.insurance
    } as SaveBeneficiaryHealthInput & MinimalBeneficiaryForFormLayout
  })

  function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryHealthInput,
    target: string | undefined
  ) {
    if (!data.value) {
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.updateHealth.mutate({
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
