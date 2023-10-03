<template>
  <BeneficiaryFormLayout
    :schema="saveBeneficiaryEntourageSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :title="RouteTitle.AppBeneficiariesSaveEntourage()"
    :previous-page="previousPage"
    :next-page="nextPage"
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
  </BeneficiaryFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryEntourageSchema,
    SaveBeneficiaryEntourageInput
  } from '~/server/schema'
  import { useAuthStore } from '~/store/auth'
  import { BeneficiaryDraft } from '~/types/beneficiary'
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, RouteTitle } from '~/utils/routing'
  import { canEditBeneficiaryHealthInfo } from '~/server/security/rules'

  definePageMeta({
    middleware: 'can-set-relatives'
  })

  const trpcClient = useTrpcClient()
  const { matomo } = useMatomo()

  const isSubmitting = ref(false)

  const route = useRoute()
  const draftId = route.params.draftId as string
  const snackbar = useSnackbar()
  const authStore = useAuthStore()

  const previousPage = {
    title: RouteTitle.AppBeneficiariesSaveTaxHousehold(),
    path: RoutePath.AppBeneficiariesSaveTaxHousehold(draftId)
  }

  const {
    data: beneficiaryDraft,
    pending,
    error
  } = await useAsyncData(loadBeneficiaryDraft)

  const user = computed(() => authStore.getAuthUser)

  const nextPage = computed(() => {
    const securityTarget = {
      referents: [user.value.id],
      structureId: user.value.structureId
    }

    if (canEditBeneficiaryHealthInfo(user.value, securityTarget)) {
      return {
        title: RouteTitle.AppBeneficiariesSaveHealth(),
        path: RoutePath.AppBeneficiariesSaveHealth(draftId)
      }
    }

    return undefined
  })

  const beneficiary = computed<SaveBeneficiaryEntourageInput | undefined>(
    () => {
      if (!beneficiaryDraft.value) {
        return undefined
      }

      const { entourage } = beneficiaryDraft.value

      return entourage || ({} as SaveBeneficiaryEntourageInput)
    }
  )

  async function loadBeneficiaryDraft() {
    const beneficiaryDraft = (await trpcClient.beneficiaryDraft.get.query({
      id: draftId
    })) as BeneficiaryDraft

    return {
      ...beneficiaryDraft,
      entourage: beneficiaryDraft.content?.entourage
    }
  }

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
    const beneficiaryDraftId = beneficiaryDraft.value?.id

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
    const beneficiaryDraftId = beneficiaryDraft.value?.id

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
