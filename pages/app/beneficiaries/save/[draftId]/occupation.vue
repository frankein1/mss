<template>
  <BeneficiaryFormLayout
    :schema="saveBeneficiaryOccupationSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :title="RouteTitle.AppBeneficiariesSaveOccupation()"
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
      <BeneficiaryFormOccupationIncome
        :family-situation="familySituation"
        :major-children="majorChildren"
      />
    </div>
  </BeneficiaryFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryOccupationSchema,
    SaveBeneficiaryOccupationInput
  } from '~/server/schema'
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, RouteTitle } from '~/utils/routing'
  import type { BeneficiaryDraft } from '~/types/beneficiary'
  import { useAuthStore } from '~/store/auth'
  import { canEditBeneficiaryHealthInfo } from '~/server/security/rules'

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

    if (canEditBeneficiaryHealthInfo(user.value, securityTarget)) {
      return {
        title: RouteTitle.AppBeneficiariesSaveHealth(),
        path: RoutePath.AppBeneficiariesSaveHealth(draftId)
      }
    }

    return {
      title: RouteTitle.AppBeneficiariesSaveInfo(),
      path: RoutePath.AppBeneficiariesSaveInfo(draftId)
    }
  })
  // TODO: Add next page

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
    const beneficiaryDraft = (await trpcClient.draft.get.query({
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

  async function saveBeneficiary(beneficiary: SaveBeneficiaryOccupationInput) {
    if (!beneficiaryDraft.value) {
      snackbar.error('La création de la fiche bénéficiaire a échoué.')
      return
    }

    isSubmitting.value = true

    try {
      const { id } = await trpcClient.beneficiary.saveDraft.mutate({
        id: beneficiaryDraft.value.id,
        occupation: beneficiary
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
    beneficiary: SaveBeneficiaryOccupationInput,
    target: string
  ) {
    if (!beneficiaryDraft.value) {
      snackbar.error("L'enregistrement du brouillon a échoué.")
      return
    }

    isSubmitting.value = true

    try {
      await trpcClient.beneficiaryDraft.update.mutate({
        id: beneficiaryDraft.value.id,
        occupation: beneficiary
      })

      navigateTo(target)
    } catch {
      snackbar.error("L'enregistrement du brouillon a échoué.")
    } finally {
      isSubmitting.value = false
    }
  }
</script>
