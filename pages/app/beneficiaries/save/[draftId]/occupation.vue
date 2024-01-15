<template>
  <BeneficiariesSaveFormLayout
    :schema="saveBeneficiaryOccupationSchema"
    :permissions="permissions"
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
  </BeneficiariesSaveFormLayout>
</template>

<script lang="ts" setup>
  import { BeneficiaryRelative } from '@prisma/client'
  import {
    saveBeneficiaryOccupationSchema,
    SaveBeneficiaryOccupationInput
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

  const { data, pending, error } =
    await trpcClient.beneficiaryDraft.get.useQuery({
      id: draftId
    })

  const permissions = computed(() => data.value?.permissions)

  const familySituation = computed(
    () => data.value?.draft.taxHousehold?.familySituation
  )
  const majorChildren = computed(
    () => data.value?.draft.taxHousehold?.majorChildren
  )

  const taxHouseholdMembers = computed(
    () =>
      (data.value?.draft.taxHousehold?.taxHouseholds ||
        []) as BeneficiaryRelative[]
  )

  const beneficiary = computed(() => {
    if (!data.value) {
      return undefined
    }

    return (
      data.value.draft.occupation ||
      ({
        mainIncomeSource: [],
        partnerMainIncomeSource: [],
        majorChildrenMainIncomeSource: [],
        otherMembersMainIncomeSource: [],
        pensionOrganisations: []
      } as SaveBeneficiaryOccupationInput)
    )
  })

  function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryOccupationInput,
    target: string | undefined
  ) {
    if (target) {
      saveBeneficiaryDraft(beneficiary, target)
    } else {
      saveBeneficiary(beneficiary)
    }
  }

  function saveBeneficiary(beneficiary: SaveBeneficiaryOccupationInput) {
    const beneficiaryDraftId = data.value?.draft.id

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
        matomo.value.trackEvent(
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
    const beneficiaryDraftId = data.value?.draft.id

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
