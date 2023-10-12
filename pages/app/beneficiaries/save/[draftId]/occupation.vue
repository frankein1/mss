<template>
  <BeneficiariesSaveFormLayout
    :schema="saveBeneficiaryOccupationSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :current-route="Route.AppBeneficiariesSaveOccupation"
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
      <BeneficiaryFormOccupationIncome
        :family-situation="familySituation"
        :major-children="majorChildren"
      />
    </div>
  </BeneficiariesSaveFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryOccupationSchema,
    SaveBeneficiaryOccupationInput
  } from '~/server/schema'
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, Route } from '~/utils/routing'
  import type { BeneficiaryDraft } from '~/types/beneficiary'

  definePageMeta({
    middleware: ['can-set-occupation']
  })

  const trpcClient = useTrpcClient()
  const { matomo } = useMatomo()

  const isSubmitting = ref(false)

  const route = useRoute()
  const snackbar = useSnackbar()
  const draftId = route.params.draftId as string

  const {
    data: beneficiaryDraft,
    pending,
    error
  } = await useAsyncData(loadBeneficiaryDraft)

  const familySituation = computed(
    () => beneficiaryDraft.value?.taxHousehold?.familySituation
  )
  const majorChildren = computed(
    () => beneficiaryDraft.value?.taxHousehold?.majorChildren
  )

  const beneficiary = computed<SaveBeneficiaryOccupationInput | undefined>(
    () => {
      if (!beneficiaryDraft.value) {
        return undefined
      }

      return (
        beneficiaryDraft.value.occupation ||
        ({
          mainIncomeSource: [],
          partnerMainIncomeSource: [],
          majorChildrenMainIncomeSource: [],
          pensionOrganisations: []
        } as SaveBeneficiaryOccupationInput)
      )
    }
  )

  async function loadBeneficiaryDraft() {
    const beneficiaryDraft = (await trpcClient.beneficiaryDraft.get.query({
      id: draftId
    })) as BeneficiaryDraft

    return {
      ...beneficiaryDraft,
      taxHousehold: beneficiaryDraft.content?.taxHousehold,
      occupation: beneficiaryDraft.content?.occupation
    }
  }

  async function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryOccupationInput,
    target: string | undefined
  ) {
    if (target) {
      await saveBeneficiaryDraft(beneficiary, target)
    } else {
      await saveBeneficiary(beneficiary)
    }
  }

  function saveBeneficiary(beneficiary: SaveBeneficiaryOccupationInput) {
    const beneficiaryDraftId = beneficiaryDraft.value?.id

    if (!beneficiaryDraftId) {
      snackbar.error('La création de la fiche bénéficiaire a échoué.')
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.saveDraft.mutate({
          id: beneficiaryDraftId,
          occupation: beneficiary
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
    beneficiary: SaveBeneficiaryOccupationInput,
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
          occupation: beneficiary
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
