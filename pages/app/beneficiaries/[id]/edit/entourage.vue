<template>
  <BeneficiaryFormLayout
    :schema="saveBeneficiaryEntourageSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :title="RouteTitle.AppBeneficiaryEditEntourage()"
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
      <BeneficiaryFormEntourages />
    </div>
  </BeneficiaryFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryEntourageSchema,
    SaveBeneficiaryEntourageInput
  } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, RouteTitle } from '~/utils/routing'
  import type { BeneficiaryNames } from '~/types/beneficiary'
  import { useAuthStore } from '~/store/auth'
  import { canEditBeneficiaryHealthInfo } from '~/server/security/rules'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'

  definePageMeta({
    middleware: ['is-beneficiary-referent', 'can-set-relatives']
  })

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string
  const saved = route.query.saved !== undefined
  const originTab = route.query.originTab
    ? (route.query.originTab as BeneficiaryTab)
    : undefined

  const authStore = useAuthStore()

  const previousPage = {
    title: RouteTitle.AppBeneficiaryEditTaxHousehold(),
    path: RoutePath.AppBeneficiaryEditTaxHousehold(beneficiaryId, {
      saved: true,
      originTab
    })
  }

  const { data, pending, error } =
    await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const user = computed(() => authStore.getAuthUser)

  const nextPage = computed(() => {
    if (!data.value) {
      return undefined
    }

    if (canEditBeneficiaryHealthInfo(user.value, data.value.beneficiary)) {
      return {
        title: RouteTitle.AppBeneficiaryEditHealth(),
        path: RoutePath.AppBeneficiaryEditHealth(beneficiaryId, {
          saved: true,
          originTab
        })
      }
    }

    return undefined
  })

  const beneficiary = computed(() => {
    if (!data.value) {
      return null
    }

    const { beneficiary: b, entourages } = data.value

    // Names and id are required for building the breadcrumb in the layout
    return {
      id: b.id,
      firstName: b.firstName,
      usualName: b.usualName,
      birthName: b.birthName,
      entourages
    } as SaveBeneficiaryEntourageInput & BeneficiaryNames & { id: string }
  })

  function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryEntourageInput,
    target: string | undefined
  ) {
    if (!data.value) {
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.updateEntourage.mutate({
          id: beneficiaryId,
          ...beneficiary
        }),
      isSubmitting,
      onSuccess: () => {
        navigateTo(target || RoutePath.AppBeneficiary(beneficiaryId))
      },
      onFailure: () => {
        useSnackbar().error('La mise à jour de la fiche bénéficaire a échoué.')
      }
    })
  }
</script>
