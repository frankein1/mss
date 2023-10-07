<template>
  <BeneficiaryFormLayout
    :schema="saveBeneficiaryHealthSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :title="RouteTitle.AppBeneficiariesSaveHealth()"
    title-icon="fr-icon-user-line"
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
      <BeneficiaryFormHealth />
    </div>
  </BeneficiaryFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryHealthSchema,
    SaveBeneficiaryHealthInput
  } from '~/server/schema'
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, RouteTitle } from '~/utils/routing'
  import type { BeneficiaryDraft } from '~/types/beneficiary'
  import { useAuthStore } from '~/store/auth'
  import {
    canEditBeneficiaryRelatives,
    canEditBeneficiaryOccupationIncome
  } from '~/server/security/rules'

  definePageMeta({
    middleware: ['can-set-health']
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

  const nextPage = computed(() => {
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

    return undefined
  })

  const beneficiary = computed<SaveBeneficiaryHealthInput | undefined>(() => {
    if (!beneficiaryDraft.value) {
      return undefined
    }

    return beneficiaryDraft.value.health || ({} as SaveBeneficiaryHealthInput)
  })

  async function loadBeneficiaryDraft() {
    const beneficiaryDraft = (await trpcClient.draft.get.query({
      id: draftId
    })) as BeneficiaryDraft

    return {
      ...beneficiaryDraft,
      health: beneficiaryDraft.content?.health
    }
  }

  async function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryHealthInput,
    target: string | undefined
  ) {
    if (target) {
      await saveBeneficiaryDraft(beneficiary, target)
    } else {
      await saveBeneficiary(beneficiary)
    }
  }

  async function saveBeneficiary(beneficiary: SaveBeneficiaryHealthInput) {
    if (!beneficiaryDraft.value) {
      snackbar.error('La création de la fiche bénéficiaire a échoué.')
      return
    }

    isSubmitting.value = true

    try {
      const { id } = await trpcClient.beneficiary.saveDraft.mutate({
        id: beneficiaryDraft.value.id,
        health: beneficiary
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
    beneficiary: SaveBeneficiaryHealthInput,
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
        health: beneficiary
      })

      navigateTo(target)
    } catch {
      snackbar.error("L'enregistrement du brouillon a échoué.")
    } finally {
      isSubmitting.value = false
    }
  }
</script>
