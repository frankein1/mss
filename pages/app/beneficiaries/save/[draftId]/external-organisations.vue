<template>
  <BeneficiariesSaveFormLayout
    :schema="saveBeneficiaryExternalOrganisationsSchema"
    :permissions="permissions"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :current-route="Route.AppBeneficiariesSaveExternalOrganisations"
    :draft-id="draftId"
    @save="onSaveBeneficiary"
  >
    <AtomAlert
      v-if="error"
      class="fr-mb-2w"
      :alert-type="AlertType.Error"
      message="Le brouillon de la fiche bénéficiaire n'a pas pu être chargé."
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
  </BeneficiariesSaveFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryExternalOrganisationsSchema,
    SaveBeneficiaryExternalOrganisationsInput
  } from '~/server/schema'
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, Route } from '~/utils/routing'

  const trpcClient = useTrpcClient()
  const { matomo } = useMatomo()

  const isSubmitting = ref(false)

  const route = useRoute()
  const snackbar = useSnackbar()
  const draftId = route.params.draftId as string

  const { data, pending, error } = trpcClient.beneficiaryDraft.get.useQuery({
    id: draftId
  })

  const permissions = computed(() => data.value?.permissions)

  const beneficiary = computed(() => {
    if (!data.value) {
      return undefined
    }

    return (
      data.value.draft.externalOrganisations ||
      ({} as SaveBeneficiaryExternalOrganisationsInput)
    )
  })

  async function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryExternalOrganisationsInput,
    target: string | undefined
  ) {
    if (target) {
      await saveBeneficiaryDraft(beneficiary, target)
    } else {
      await saveBeneficiary(beneficiary)
    }
  }

  function saveBeneficiary(
    beneficiary: SaveBeneficiaryExternalOrganisationsInput
  ) {
    const beneficiaryDraftId = data.value?.draft.id
    if (!beneficiaryDraftId) {
      snackbar.error('La création de la fiche bénéficiaire a échoué.')
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.saveDraft.mutate({
          id: beneficiaryDraftId,
          externalOrganisations: beneficiary
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

  function saveBeneficiaryDraft(
    beneficiary: SaveBeneficiaryExternalOrganisationsInput,
    target: string
  ) {
    const beneficiaryDraftId = data.value?.draft.id
    if (!beneficiaryDraftId) {
      snackbar.error("L'enregistrement du brouillon a échoué.")
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiaryDraft.update.mutate({
          id: beneficiaryDraftId,
          externalOrganisations: beneficiary
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
