<template>
  <BeneficiaryFormLayout
    :schema="saveBeneficiaryTaxHouseholdSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :title="RouteTitle.AppBeneficiaryEditTaxHousehold()"
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
      <BeneficiaryFormFamilySituation />
      <BeneficiaryFormTaxHouseholds :current-beneficiary-id="beneficiaryId" />
    </div>
  </BeneficiaryFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryTaxHouseholdSchema,
    SaveBeneficiaryTaxHouseholdInput
  } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, RouteTitle } from '~/utils/routing'
  import type { BeneficiaryNames } from '~/types/beneficiary'

  definePageMeta({
    middleware: ['is-beneficiary-referent', 'can-set-relatives']
  })

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string
  const saved = route.query.saved !== undefined

  const previousPage = {
    title: RouteTitle.AppBeneficiaryEditInfo(),
    path: RoutePath.AppBeneficiaryEditInfo(beneficiaryId, { saved: true })
  }

  const nextPage = {
    title: RouteTitle.AppBeneficiaryEditEntourage(),
    path: RoutePath.AppBeneficiaryEditEntourage(beneficiaryId, { saved: true })
  }

  const { data, pending, error } =
    await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const beneficiary = computed(() => {
    if (!data.value) {
      return null
    }

    const { beneficiary: b, taxHouseholds } = data.value

    // Names and id are required for building the breadcrumb in the layout
    return {
      id: b.id,
      firstName: b.firstName,
      usualName: b.usualName,
      birthName: b.birthName,
      familySituation: b.familySituation,
      majorChildren: b.majorChildren,
      minorChildren: b.minorChildren,
      caregiver: b.caregiver,
      taxHouseholds
    } as SaveBeneficiaryTaxHouseholdInput & BeneficiaryNames & { id: string }
  })

  async function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryTaxHouseholdInput,
    target: string | undefined
  ) {
    if (!data.value) {
      return
    }

    isSubmitting.value = true

    try {
      await trpcClient.beneficiary.updateTaxHousehold.mutate({
        id: beneficiaryId,
        structureId: data.value.beneficiary.structureId,
        ...beneficiary
      })

      navigateTo(target || RoutePath.AppBeneficiary(beneficiaryId))
    } catch {
      useSnackbar().error('La mise à jour de la fiche bénéficiaire a échoué.')
    } finally {
      isSubmitting.value = false
    }
  }
</script>
