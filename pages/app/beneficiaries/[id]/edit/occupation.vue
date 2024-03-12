<template>
  <BeneficiaryEditFormLayout
    :beneficiary="beneficiary?.identity || null"
    :schema="saveBeneficiaryOccupationSchema"
    :permissions="permissions"
    :is-submitting="isSubmitting"
    :current-route="Route.AppBeneficiaryEditOccupation"
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
      v-else-if="beneficiary && permissions"
      class="fr-p-3v"
    >
      <BeneficiaryFormOccupationIncome
        :permissions="permissions"
        :family-situation="familySituation"
        :major-children="majorChildren"
        :tax-household-members="taxHouseholdMembers"
      />
    </div>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryOccupationSchema,
    SaveBeneficiaryOccupationInput
  } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, Route } from '~/utils/routing'

  definePageMeta({
    name: Route.AppBeneficiaryEditOccupation
  })

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const { data, pending, error } =
    await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const permissions = computed(() => data.value?.permissions)

  const beneficiary = computed(() =>
    data.value ? data.value.beneficiary : null
  )

  const familySituation = computed(
    () => data.value?.beneficiary.taxHouseholds?.familySituation
  )
  const majorChildren = computed(
    () => data.value?.beneficiary.taxHouseholds?.majorChildren
  )

  const taxHouseholdMembers = computed(
    () => data.value?.beneficiary.taxHouseholds?.taxHouseholds || []
  )

  function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryOccupationInput,
    target: string | undefined
  ) {
    if (!data.value) {
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.updateOccupationIncome.mutate({
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
