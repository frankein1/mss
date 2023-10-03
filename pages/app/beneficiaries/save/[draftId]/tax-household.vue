<template>
  <BeneficiaryFormLayout
    :schema="saveBeneficiaryTaxHouseholdSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :title="RouteTitle.AppBeneficiariesSaveTaxHousehold()"
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
      <BeneficiaryFormFamilySituation />
      <BeneficiaryFormTaxHouseholds />
    </div>
  </BeneficiaryFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryTaxHouseholdSchema,
    SaveBeneficiaryTaxHouseholdInput
  } from '~/server/schema'
  import { BeneficiaryDraft } from '~/types/beneficiary'
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, RouteTitle } from '~/utils/routing'

  definePageMeta({
    middleware: 'can-set-relatives'
  })

  const trpcClient = useTrpcClient()
  const { matomo } = useMatomo()

  const isSubmitting = ref(false)

  const route = useRoute()
  const draftId = route.params.draftId as string
  const snackbar = useSnackbar()

  const previousPage = {
    title: RouteTitle.AppBeneficiariesSaveInfo(),
    path: RoutePath.AppBeneficiariesSaveInfo(draftId)
  }

  const nextPage = {
    title: RouteTitle.AppBeneficiariesSaveEntourage(),
    path: RoutePath.AppBeneficiariesSaveEntourage(draftId)
  }

  const {
    data: beneficiaryDraft,
    pending,
    error
  } = await useAsyncData(loadBeneficiaryDraft)

  const beneficiary = computed<SaveBeneficiaryTaxHouseholdInput | undefined>(
    () => {
      if (!beneficiaryDraft.value) {
        return undefined
      }

      const { taxHousehold } = beneficiaryDraft.value

      return taxHousehold || ({} as SaveBeneficiaryTaxHouseholdInput)
    }
  )

  async function loadBeneficiaryDraft() {
    const beneficiaryDraft = (await trpcClient.beneficiaryDraft.get.query({
      id: draftId
    })) as BeneficiaryDraft

    return {
      ...beneficiaryDraft,
      taxHousehold: beneficiaryDraft.content?.taxHousehold
    }
  }

  async function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryTaxHouseholdInput,
    target: string | undefined
  ) {
    if (target) {
      await saveBeneficiaryDraft(beneficiary, target)
    } else {
      await saveBeneficiary(beneficiary)
    }
  }

  function saveBeneficiary(beneficiary: SaveBeneficiaryTaxHouseholdInput) {
    const beneficiaryDraftId = beneficiaryDraft.value?.id

    if (!beneficiaryDraftId) {
      snackbar.error('La création de la fiche bénéficiaire a échoué.')
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.saveDraft.mutate({
          id: beneficiaryDraftId,
          taxHousehold: beneficiary
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
    beneficiary: SaveBeneficiaryTaxHouseholdInput,
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
          taxHousehold: beneficiary
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
