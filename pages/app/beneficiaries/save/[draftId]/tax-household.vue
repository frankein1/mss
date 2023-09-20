<template>
  <BeneficiaryFormLayout
    :schema="saveBeneficiaryTaxHouseholdSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :title="RouteTitle.AppBeneficiariesSaveTaxHousehold()"
    saved
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
  const snackbar = useSnackbar()

  const {
    data: beneficiaryDraft,
    pending,
    error
  } = await useAsyncData(loadBeneficiaryDraft)

  const beneficiary = computed<SaveBeneficiaryTaxHouseholdInput>(() => ({
    familySituation: beneficiaryDraft.value?.taxHousehold?.familySituation,
    majorChildren: beneficiaryDraft.value?.taxHousehold?.majorChildren,
    minorChildren: beneficiaryDraft.value?.taxHousehold?.minorChildren,
    taxHouseholds: beneficiaryDraft.value?.taxHousehold?.taxHouseholds
  }))

  async function loadBeneficiaryDraft() {
    const draftId = route.params.draftId as string

    const beneficiaryDraft = (await trpcClient.draft.get.query({
      id: draftId
    })) as BeneficiaryDraft

    return {
      ...beneficiaryDraft,
      taxHousehold: beneficiaryDraft.content?.taxHousehold || null
    }
  }

  async function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryTaxHouseholdInput,
    saveAndLeave: boolean
  ) {
    if (saveAndLeave) {
      await saveBeneficairy(beneficiary)
    } else {
      await saveBeneficiaryDraft(beneficiary)
    }
  }

  async function saveBeneficairy(
    beneficiary: SaveBeneficiaryTaxHouseholdInput
  ) {
    if (!beneficiaryDraft.value) {
      snackbar.error('La création de la fiche bénéficiaire a échoué.')
      return
    }

    isSubmitting.value = true

    try {
      const { id } = await trpcClient.beneficiary.saveDraft.mutate({
        id: beneficiaryDraft.value.id,
        taxHousehold: beneficiary
      })

      matomo.trackEvent(
        EventCategory.CreateBeneficiary,
        CreateBeneficiaryEventAction.SaveCompleteForm
      )

      navigateTo(RoutePath.AppBeneficiary(id))
    } catch {
      snackbar.error('La création de la fiche bénéficiaire a échoué.')
    } finally {
      isSubmitting.value = false
    }
  }

  async function saveBeneficiaryDraft(
    beneficiary: SaveBeneficiaryTaxHouseholdInput
  ) {
    if (!beneficiaryDraft.value) {
      snackbar.error("L'enregistrement du brouillon a échoué.")
      return
    }

    isSubmitting.value = true

    try {
      await trpcClient.beneficiaryDraft.update.mutate({
        id: beneficiaryDraft.value.id,
        taxHousehold: beneficiary
      })

      // TODO: Navigation post submit
      // navigateTo(RoutePath.AppBeneficiary(id))
    } catch {
      snackbar.error("L'enregistrement du brouillon a échoué.")
    } finally {
      isSubmitting.value = false
    }
  }
</script>
