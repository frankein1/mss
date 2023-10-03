<template>
  <BeneficiaryFormLayout
    :schema="saveBeneficiaryOccupationSchema"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :previous-page="previousPage"
    :next-page="nextPage"
    :saved="saved"
    :current="Route.AppBeneficiaryEditOccupation"
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
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, RouteTitle, Route } from '~/utils/routing'
  import type { BeneficiaryNames } from '~/types/beneficiary'
  import { useAuthStore } from '~/store/auth'
  import {
    canEditBeneficiaryHealthInfo,
    canEditBeneficiaryExternalOrganisations,
    canEditBeneficiaryRelatives
  } from '~/server/security/rules'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'

  definePageMeta({
    middleware: ['is-beneficiary-referent', 'can-set-occupation']
  })

  const trpcClient = useTrpcClient()
  const authStore = useAuthStore()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string
  const saved = route.query.saved !== undefined
  const originTab = route.query.originTab
    ? (route.query.originTab as BeneficiaryTab)
    : undefined

  const { data, pending, error } =
    await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const user = computed(() => authStore.getAuthUser)

  const previousPage = computed(() => {
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

    if (canEditBeneficiaryRelatives(user.value, data.value.beneficiary)) {
      return {
        title: RouteTitle.AppBeneficiaryEditEntourage(),
        path: RoutePath.AppBeneficiaryEditEntourage(beneficiaryId, {
          saved: true,
          originTab
        })
      }
    }

    return {
      title: RouteTitle.AppBeneficiaryEditInfo(),
      path: RoutePath.AppBeneficiaryEditInfo(beneficiaryId, {
        saved: true,
        originTab
      })
    }
  })

  const nextPage = computed(() => {
    if (!data.value) {
      return undefined
    }

    if (
      canEditBeneficiaryExternalOrganisations(
        user.value,
        data.value.beneficiary
      )
    ) {
      return {
        title: RouteTitle.AppBeneficiaryEditExternalOrganisations(),
        path: RoutePath.AppBeneficiaryEditExternalOrganisations(beneficiaryId, {
          saved: true,
          originTab
        })
      }
    }

    return undefined
  })

  const familySituation = computed(
    () => data.value?.beneficiary.familySituation
  )
  const majorChildren = computed(() => data.value?.beneficiary.majorChildren)

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
      socioProfessionalCategory: b.socioProfessionalCategory,
      occupation: b.occupation,
      employer: b.employer,
      employerSiret: b.employerSiret,
      mainIncomeSource: b.mainIncomeSource || [],
      mainIncomeAmount: prismaDecimalToNumber(b.mainIncomeAmount),
      partnerMainIncomeSource: b.partnerMainIncomeSource || [],
      partnerMainIncomeAmount: prismaDecimalToNumber(b.partnerMainIncomeAmount),
      majorChildrenMainIncomeSource: b.majorChildrenMainIncomeSource || [],
      majorChildrenMainIncomeAmount: prismaDecimalToNumber(
        b.majorChildrenMainIncomeAmount
      ),
      unemploymentNumber: b.unemploymentNumber,
      pensionOrganisations: b.pensionOrganisations || [],
      otherPensionOrganisations: b.otherPensionOrganisations,
      cafNumber: b.cafNumber,
      bank: b.bank,
      funeralContract: b.funeralContract,
      ministereCategorie: b.ministereCategorie,
      ministereDepartementServiceAc: b.ministereDepartementServiceAc,
      ministereStructure: b.ministereStructure
    } as SaveBeneficiaryOccupationInput & BeneficiaryNames & { id: string }
  })

  async function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryOccupationInput,
    target: string | undefined
  ) {
    if (!data.value) {
      return
    }

    isSubmitting.value = true

    try {
      await trpcClient.beneficiary.updateOccupationIncome.mutate({
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
