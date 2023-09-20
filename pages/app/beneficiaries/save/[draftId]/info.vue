<template>
  <BeneficiaryFormLayout
    :schema="saveBeneficiaryGeneralInformationSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :title="RouteTitle.AppBeneficiariesSaveInfo()"
    title-icon="fr-icon-user-line"
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
  import { UserStatus } from '@prisma/client'
  import {
    SaveBeneficiaryGeneralInformationInput,
    saveBeneficiaryGeneralInformationSchema
  } from '~/server/schema'
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, RouteTitle } from '~/utils/routing'
  import type { BeneficiaryDraft } from '~/types/beneficiary'

  const trpcClient = useTrpcClient()
  const { matomo } = useMatomo()

  const isSubmitting = ref(false)

  const route = useRoute()
  const snackbar = useSnackbar()

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

  const beneficiary = computed<SaveBeneficiaryGeneralInformationInput>(() => ({
    referents: beneficiaryDraft.value?.general?.referents || [],
    aidantConnectAuthorized:
      beneficiaryDraft.value?.general?.aidantConnectAuthorized || false,
    status: beneficiaryDraft.value?.general?.status || UserStatus.Active,
    firstName: beneficiaryDraft.value?.general?.firstName || '',
    usualName: beneficiaryDraft.value?.general?.usualName,
    birthName: beneficiaryDraft.value?.general?.birthName || '',
    birthDate: beneficiaryDraft.value?.general?.birthDate,
    numeroPegase: beneficiaryDraft.value?.general?.numeroPegase,
    noPhone: false,
    phone1: beneficiaryDraft.value?.general?.phone1,
    email: beneficiaryDraft.value?.general?.email,
    caregiver: false
  }))

  async function loadBeneficiaryDraft() {
    const draftId = route.params.draftId as string

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
    saveAndLeave: boolean
  ) {
    if (saveAndLeave) {
      await saveBeneficairy(beneficiary)
    } else {
      await saveBeneficiaryDraft(beneficiary)
    }
  }

  async function saveBeneficairy(
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
    beneficiary: SaveBeneficiaryGeneralInformationInput
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

      navigateTo(
        RoutePath.AppBeneficiariesSaveTaxHousehold(beneficiaryDraft.value.id)
      )
    } catch {
      snackbar.error("L'enregistrement du brouillon a échoué.")
    } finally {
      isSubmitting.value = false
    }
  }
</script>
