<template>
  <BeneficiaryEditFormLayout
    :schema="saveBeneficiaryTaxHouseholdSchema"
    :permissions="permissions"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :current-route="Route.AppBeneficiaryEditTaxHousehold"
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
      <BeneficiaryFormTaxHouseholds :current-beneficiary-id="beneficiaryId" />
    </div>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryTaxHouseholdSchema,
    SaveBeneficiaryTaxHouseholdInput
  } from '~/server/schema'
  import { MinimalBeneficiaryForFormLayout } from '~/types/beneficiary'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, Route } from '~/utils/routing'

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const { data, pending, error } =
    await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const permissions = computed(() => data.value?.permissions)

  const beneficiary = computed(() => {
    if (!data.value) {
      return null
    }

    const {
      beneficiary: { id, meta, general, taxHouseholds }
    } = data.value

    // Names and id are required for building the breadcrumb in the layout
    return {
      id,
      structureId: meta.structureId,
      referents: meta.referents,
      firstName: general.firstName,
      usualName: general.usualName,
      birthName: general.birthName,
      ...taxHouseholds
    } as SaveBeneficiaryTaxHouseholdInput & MinimalBeneficiaryForFormLayout
  })

  function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryTaxHouseholdInput,
    target: string | undefined
  ) {
    if (!data.value) {
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.updateTaxHousehold.mutate({
          id: beneficiaryId,
          ...beneficiary
        }),
      isSubmitting,
      onSuccess: () => {
        navigateTo(target || RoutePath.AppBeneficiary(beneficiaryId))
      },
      onFailure: () => {
        useSnackbar().error('La mise à jour de la fiche bénéficiaire a échoué.')
      }
    })
  }
</script>
