<template>
  <BeneficiaryEditFormLayout
    v-if="permissions"
    :schema="saveBeneficiaryEntourageSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :permissions="permissions"
    :current-route="Route.AppBeneficiaryEditEntourage"
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
      <BeneficiaryFormEntourages />
    </div>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryEntourageSchema,
    SaveBeneficiaryEntourageInput
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

    const { beneficiary: b, entourages } = data.value

    // Names and id are required for building the breadcrumb in the layout
    return {
      id: b.id,
      structureId: b.structureId,
      referents: b.referents,
      firstName: b.firstName,
      usualName: b.usualName,
      birthName: b.birthName,
      entourages
    } as SaveBeneficiaryEntourageInput & MinimalBeneficiaryForFormLayout
  })

  function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryEntourageInput,
    target: string | undefined
  ) {
    if (!data.value) {
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.updateEntourage.mutate({
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
