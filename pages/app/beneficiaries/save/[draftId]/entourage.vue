<template>
  <BeneficiariesSaveFormLayout
    :schema="saveBeneficiaryEntourageSchema"
    :permissions="permissions"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :current-route="Route.AppBeneficiariesSaveEntourage"
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
      <BeneficiaryFormEntourages />
    </div>
  </BeneficiariesSaveFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryEntourageSchema,
    SaveBeneficiaryEntourageInput
  } from '~/server/schema'
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, Route } from '~/utils/routing'

  const trpcClient = useTrpcClient()
  const { matomo } = useMatomo()

  const isSubmitting = ref(false)

  const route = useRoute()
  const draftId = route.params.draftId as string
  const snackbar = useSnackbar()

  const { data, pending, error } = trpcClient.beneficiaryDraft.get.useQuery({
    id: draftId
  })

  const permissions = computed(() => data.value?.permissions)

  const beneficiary = computed(() => {
    if (!data.value) {
      return undefined
    }

    const { entourage } = data.value.draft

    return entourage || ({} as SaveBeneficiaryEntourageInput)
  })

  async function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryEntourageInput,
    target: string | undefined
  ) {
    if (target) {
      await saveBeneficiaryDraft(beneficiary, target)
    } else {
      await saveBeneficiary(beneficiary)
    }
  }

  function saveBeneficiary(beneficiary: SaveBeneficiaryEntourageInput) {
    const beneficiaryDraftId = data.value?.draft.id

    if (!beneficiaryDraftId) {
      snackbar.error('La création de la fiche bénéficiaire a échoué.')
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.saveDraft.mutate({
          id: beneficiaryDraftId,
          entourage: beneficiary
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
    beneficiary: SaveBeneficiaryEntourageInput,
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
          entourage: beneficiary
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
