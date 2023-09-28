<template>
  <BeneficiaryFormLayout
    :schema="saveBeneficiaryGeneralInformationSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :title="RouteTitle.AppBeneficiariesSaveInfo()"
    title-icon="fr-icon-user-line"
    :next-page="nextPage"
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
      v-else-if="beneficiary && agents?.length"
      :beneficiary="beneficiary"
      :agents="agents"
    />
  </BeneficiaryFormLayout>
</template>

<script lang="ts" setup>
  import {
    SaveBeneficiaryGeneralInformationInput,
    saveBeneficiaryGeneralInformationSchema
  } from '~/server/schema'
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, RouteTitle } from '~/utils/routing'
  import type { BeneficiaryDraft } from '~/types/beneficiary'
  import { useAuthStore } from '~/store/auth'
  import { canEditBeneficiaryRelatives } from '~/server/security/rules'

  const trpcClient = useTrpcClient()
  const { matomo } = useMatomo()

  const isSubmitting = ref(false)

  const route = useRoute()
  const snackbar = useSnackbar()
  const draftId = route.params.draftId as string
  const authStore = useAuthStore()

  const {
    data: agents,
    pending: agentsPending,
    error: agentsError
  } = await trpcClient.config.getAgents.useQuery()

  const {
    data: beneficiaryDraft,
    pending: beneficiaryDraftPending,
    error: beneficiaryDraftError
  } = await useAsyncData(loadBeneficiaryDraft)

  const pending = computed(
    () => agentsPending.value || beneficiaryDraftPending.value
  )

  const fetchError = computed(() => {
    if (beneficiaryDraftError.value) {
      return "Le brouillon de la fiche bénéficiaire n'a pas pu être chargé."
    }
    if (agentsError.value) {
      return "La liste des référents n'a pas pu être chargée."
    }
    return ''
  })

  const user = computed(() => authStore.getAuthUser)

  const nextPage = computed(() => {
    if (
      canEditBeneficiaryRelatives(user.value, {
        referents: [user.value.id],
        structureId: user.value.structureId
      })
    ) {
      return {
        title: RouteTitle.AppBeneficiariesSaveTaxHousehold(),
        path: RoutePath.AppBeneficiariesSaveTaxHousehold(draftId)
      }
    }

    return undefined
  })

  const beneficiary = computed<
    SaveBeneficiaryGeneralInformationInput | undefined
  >(() => {
    if (!beneficiaryDraft.value?.general) {
      return undefined
    }

    const b = beneficiaryDraft.value.general

    return {
      ...b,
      birthDate: b.birthDate ? new Date(b.birthDate) : undefined,
      deathDate: b.deathDate ? new Date(b.deathDate) : undefined
    }
  })

  async function loadBeneficiaryDraft() {
    const beneficiaryDraft = (await trpcClient.draft.get.query({
      id: draftId
    })) as BeneficiaryDraft

    return {
      ...beneficiaryDraft,
      general: beneficiaryDraft.content?.general || null
    }
  }

  async function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryGeneralInformationInput,
    target: string | undefined
  ) {
    if (target) {
      await saveBeneficiaryDraft(beneficiary, target)
    } else {
      await saveBeneficiary(beneficiary)
    }
  }

  async function saveBeneficiary(
    beneficiary: SaveBeneficiaryGeneralInformationInput
  ) {
    if (!beneficiaryDraft.value) {
      snackbar.error('La création de la fiche bénéficiaire a échoué.')
      return
    }

    isSubmitting.value = true

    try {
      const { id } = await trpcClient.beneficiary.saveDraft.mutate({
        id: beneficiaryDraft.value.id,
        general: beneficiary
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
    beneficiary: SaveBeneficiaryGeneralInformationInput,
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
        general: beneficiary
      })

      navigateTo(target)
    } catch {
      snackbar.error("L'enregistrement du brouillon a échoué.")
    } finally {
      isSubmitting.value = false
    }
  }
</script>
