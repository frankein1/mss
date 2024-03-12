<template>
  <BeneficiaryEditFormLayout
    :beneficiary="beneficiary?.identity || null"
    :schema="saveBeneficiaryGeneralInformationSchema"
    :permissions="permissions"
    :is-submitting="isSubmitting"
    title-icon="fr-icon-user-line"
    :current-route="Route.AppBeneficiaryEditInfo"
    @save="onSaveBeneficiary"
  >
    <AtomAlert
      v-if="fetchError"
      class="fr-mb-2w"
      :alert-type="AlertType.Error"
      :message="fetchError"
    />
    <AtomLoader
      v-else-if="pending"
      class="fr-mx-auto"
    />
    <BeneficiaryFormGeneralInformation
      v-else-if="beneficiary && permissions && agents?.length"
      :permissions="permissions"
      :beneficiary="beneficiary"
      :agents="agents"
    />
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    SaveBeneficiaryGeneralInformationInput,
    saveBeneficiaryGeneralInformationSchema
  } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, Route } from '~/utils/routing'

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const {
    data: agents,
    pending: agentsPending,
    error: agentsError
  } = await trpcClient.config.getAgents.useQuery()

  const {
    data,
    pending: beneficiaryPending,
    error: beneficiaryError
  } = await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
    id: beneficiaryId
  })

  const pending = computed(
    () => agentsPending.value || beneficiaryPending.value
  )

  const permissions = computed(() => data.value?.permissions)

  const beneficiary = computed(() =>
    data.value ? data.value.beneficiary : null
  )

  const fetchError = computed(() => {
    if (beneficiaryError.value) {
      return "Les informations du bénéficiaires n'ont pas pu être chargées."
    }
    if (agentsError.value) {
      return "La liste des agents référents n'a pas pu être chargée."
    }
    return ''
  })

  function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryGeneralInformationInput,
    target: string | undefined
  ) {
    if (!data.value) {
      return
    }

    const { structureId } = data.value.beneficiary

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.updateGeneralInformation.mutate({
          id: beneficiaryId,
          structureId,
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
