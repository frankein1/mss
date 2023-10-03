<template>
  <BeneficiaryFormLayout
    :schema="saveBeneficiaryExternalOrganisationsSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :title="RouteTitle.AppBeneficiariesSaveExternalOrganisations()"
    title-icon="fr-icon-user-line"
    :previous-page="previousPage"
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
  </BeneficiaryFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryExternalOrganisationsSchema,
    SaveBeneficiaryExternalOrganisationsInput
  } from '~/server/schema'
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, RouteTitle } from '~/utils/routing'
  import type { BeneficiaryDraft } from '~/types/beneficiary'
  import { useAuthStore } from '~/store/auth'
  import {
    canEditBeneficiaryHealthInfo,
    canEditBeneficiaryRelatives,
    canEditBeneficiaryOccupationIncome
  } from '~/server/security/rules'

  definePageMeta({
    middleware: ['can-set-external-organisations']
  })

  const trpcClient = useTrpcClient()
  const { matomo } = useMatomo()

  const isSubmitting = ref(false)

  const route = useRoute()
  const snackbar = useSnackbar()
  const draftId = route.params.draftId as string
  const authStore = useAuthStore()

  const {
    data: beneficiaryDraft,
    pending,
    error
  } = await useAsyncData(loadBeneficiaryDraft)

  const user = computed(() => authStore.getAuthUser)

  const previousPage = computed(() => {
    const securityTarget = {
      referents: [user.value.id],
      structureId: user.value.structureId
    }

    if (canEditBeneficiaryOccupationIncome(user.value, securityTarget)) {
      return {
        title: RouteTitle.AppBeneficiariesSaveOccupation(),
        path: RoutePath.AppBeneficiariesSaveOccupation(draftId)
      }
    }

    if (canEditBeneficiaryHealthInfo(user.value, securityTarget)) {
      return {
        title: RouteTitle.AppBeneficiariesSaveHealth(),
        path: RoutePath.AppBeneficiariesSaveHealth(draftId)
      }
    }

    if (canEditBeneficiaryRelatives(user.value, securityTarget)) {
      return {
        title: RouteTitle.AppBeneficiariesSaveEntourage(),
        path: RoutePath.AppBeneficiariesSaveEntourage(draftId)
      }
    }

    return {
      title: RouteTitle.AppBeneficiariesSaveInfo(),
      path: RoutePath.AppBeneficiariesSaveInfo(draftId)
    }
  })

  const beneficiary = computed<
    SaveBeneficiaryExternalOrganisationsInput | undefined
  >(() => {
    if (!beneficiaryDraft.value) {
      return undefined
    }

    return (
      beneficiaryDraft.value.externalOrganisations ||
      ({} as SaveBeneficiaryExternalOrganisationsInput)
    )
  })

  async function loadBeneficiaryDraft() {
    const beneficiaryDraft = (await trpcClient.beneficiaryDraft.get.query({
      id: draftId
    })) as BeneficiaryDraft

    return {
      ...beneficiaryDraft,
      externalOrganisations: beneficiaryDraft.content?.externalOrganisations
    }
  }

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
    const beneficiaryDraftId = beneficiaryDraft.value?.id
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
    const beneficiaryDraftId = beneficiaryDraft.value?.id
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
