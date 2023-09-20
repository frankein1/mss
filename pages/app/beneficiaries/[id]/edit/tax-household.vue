<template>
  <BeneficiaryFormLayout
    :schema="saveBeneficiaryTaxHouseholdSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :title="RouteTitle.AppBeneficiaryEditTaxHousehold()"
    is-editting
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
      <BeneficiaryFormFamilySituation />
    </div>
  </BeneficiaryFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryTaxHouseholdSchema,
    SaveBeneficiaryTaxHouseholdInput
  } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, RouteTitle } from '~/utils/routing'

  definePageMeta({
    middleware: ['is-beneficiary-referent', 'can-set-relatives']
  })

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

    const b = data.value.beneficiary

    return {
      familySituation: b.familySituation,
      majorChildren: b.majorChildren,
      minorChildren: b.minorChildren,
      taxHouseholds: data.value.taxHouseholds
    } as SaveBeneficiaryTaxHouseholdInput
  })

  async function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryTaxHouseholdInput
  ) {
    if (!data.value) {
      return
    }

    isSubmitting.value = true

    try {
      await trpcClient.beneficiary.updateTaxHousehold.mutate({
        id: beneficiaryId,
        structureId: data.value.beneficiary.structureId,
        ...beneficiary
      })

      navigateTo(RoutePath.AppBeneficiary(beneficiaryId))
    } catch {
      useSnackbar().error('La mise à jour de la synthèse a échoué.')
    } finally {
      isSubmitting.value = false
    }
  }
</script>
