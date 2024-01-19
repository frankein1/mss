<template>
  <BeneficiariesSaveFormLayout
    :schema="saveBeneficiaryGeneralInformationSchema"
    :permissions="permissions"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    title-icon="fr-icon-user-line"
    :current-route="Route.AppBeneficiariesSaveInfo"
    :draft-id="draftId"
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
  </BeneficiariesSaveFormLayout>
</template>

<script lang="ts" setup>
  import {
    SaveBeneficiaryGeneralInformationInput,
    saveBeneficiaryGeneralInformationSchema
  } from '~/server/schema'
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, Route } from '~/utils/routing'

  const trpcClient = useTrpcClient()
  const matomo = useMatomo()

  const isSubmitting = ref(false)

  const route = useRoute()
  const snackbar = useSnackbar()
  const draftId = route.params.draftId as string

  const {
    data: agents,
    pending: agentsPending,
    error: agentsError
  } = await trpcClient.config.getAgents.useQuery()

  const {
    data,
    pending: draftPending,
    error: draftError
  } = await trpcClient.beneficiaryDraft.get.useQuery({
    id: draftId
  })

  const permissions = computed(() => data.value?.permissions)

  const pending = computed(() => agentsPending.value || draftPending.value)

  const fetchError = computed(() => {
    if (draftError.value) {
      return "Le brouillon de la fiche bénéficiaire n'a pas pu être chargé."
    }
    if (agentsError.value) {
      return "La liste des référents n'a pas pu être chargée."
    }
    return ''
  })

  const beneficiary = computed(() => {
    if (!data.value?.draft.general) {
      return undefined
    }

    const { general } = data.value.draft

    return {
      ...general,
      birthDate: general.birthDate ? new Date(general.birthDate) : undefined,
      deathDate: general.deathDate ? new Date(general.deathDate) : undefined
    }
  })

  function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryGeneralInformationInput,
    target: string | undefined
  ) {
    if (target) {
      saveDraft(beneficiary, target)
    } else {
      saveBeneficiary(beneficiary)
    }
  }

  function saveBeneficiary(
    beneficiary: SaveBeneficiaryGeneralInformationInput
  ) {
    const draftId = data.value?.draft.id

    if (!draftId) {
      snackbar.error('La création de la fiche bénéficiaire a échoué.')
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.saveDraft.mutate({
          id: draftId,
          general: beneficiary
        }),
      isSubmitting,
      onSuccess: ({ id }) => {
        matomo.trackEvent(
          EventCategory.CreateBeneficiary,
          CreateBeneficiaryEventAction.SaveCompleteForm
        )

        navigateTo(RoutePath.AppBeneficiary(id))
      },
      onFailure: () => {
        snackbar.error('La création de la fiche bénéficiaire a échoué.')
      }
    })
  }

  function saveDraft(
    beneficiary: SaveBeneficiaryGeneralInformationInput,
    target: string
  ) {
    const draftId = data.value?.draft.id

    if (!draftId) {
      snackbar.error("L'enregistrement du brouillon a échoué.")
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiaryDraft.update.mutate({
          id: draftId,
          general: beneficiary
        }),
      isSubmitting,
      onSuccess: () => {
        navigateTo(target)
      },
      onFailure: () => {
        snackbar.error("L'enregistrement du brouillon a échoué.")
      }
    })
  }
</script>
