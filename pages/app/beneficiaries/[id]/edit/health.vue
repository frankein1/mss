<template>
  <BeneficiaryFormLayout
    :schema="saveBeneficiaryHealthSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :title="RouteTitle.AppBeneficiaryEditHealth()"
    is-editting
    :previous-page="previousPage"
    :next-page="nextPage"
    :saved="saved"
    @save="onSaveBeneficiary"
  >
    <AtomAlert
      v-if="error"
      class="fr-mb-2w"
      :alert-type="AlertType.Error"
      message="Les informations du bénéficiaires n'ont pas pu être chargées."
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
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, RouteTitle } from '~/utils/routing'
  import type { BeneficiaryNames } from '~/types/beneficiary'
  import { useAuthStore } from '~/store/auth'
  import {
    canEditBeneficiaryRelatives,
    canEditBeneficiaryOccupationIncome
  } from '~/server/security/rules'

  definePageMeta({
    middleware: ['is-beneficiary-referent', 'can-set-health']
  })

  const trpcClient = useTrpcClient()
  const authStore = useAuthStore()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string
  const saved = route.query.saved !== undefined

  const { data, pending, error } =
    await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const user = computed(() => authStore.getAuthUser)

  const previousPage = computed(() => {
    if (!data.value) {
      return undefined
    }

    if (canEditBeneficiaryRelatives(user.value, data.value.beneficiary)) {
      return {
        title: RouteTitle.AppBeneficiaryEditEntourage(),
        path: RoutePath.AppBeneficiaryEditEntourage(beneficiaryId, {
          saved: true
        })
      }
    }

    return {
      title: RouteTitle.AppBeneficiaryEditInfo(),
      path: RoutePath.AppBeneficiaryEditInfo(beneficiaryId, { saved: true })
    }
  })

  const nextPage = computed(() => {
    if (!data.value) {
      return undefined
    }

    if (
      canEditBeneficiaryOccupationIncome(user.value, data.value.beneficiary)
    ) {
      return {
        title: RouteTitle.AppBeneficiaryEditOccupation(),
        path: RoutePath.AppBeneficiaryEditOccupation(beneficiaryId, {
          saved: true
        })
      }
    }

    return undefined
  })

  const beneficiary = computed(() => {
    if (!data.value) {
      return null
    }

    const { beneficiary: b } = data.value

    // Names and id are required for building the breadcrumb in the layout
    return {
      id: b.id,
      firstName: b.firstName,
      usualName: b.usualName,
      birthName: b.birthName,
      gir: b.gir,
      doctor: b.doctor,
      healthAdditionalInformation: b.healthAdditionalInformation,
      socialSecurityNumber: b.socialSecurityNumber,
      insurance: b.insurance
    } as SaveBeneficiaryHealthInput & BeneficiaryNames & { id: string }
  })

  async function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryHealthInput,
    target: string | undefined
  ) {
    if (!data.value) {
      return
    }

    isSubmitting.value = true

    try {
      await trpcClient.beneficiary.updateHealth.mutate({
        id: beneficiaryId,
        ...beneficiary
      })

      navigateTo(target || RoutePath.AppBeneficiary(beneficiaryId))
    } catch {
      useSnackbar().error('La mise à jour de la fiche bénéficaire a échoué.')
    } finally {
      isSubmitting.value = false
    }
  }
</script>
