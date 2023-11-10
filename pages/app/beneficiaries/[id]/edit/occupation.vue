<template>
  <BeneficiaryEditFormLayout
    v-if="permissions"
    :schema="saveBeneficiaryOccupationSchema"
    :permissions="permissions"
    :is-submitting="isSubmitting"
    :beneficiary="beneficiary"
    :current-route="Route.AppBeneficiaryEditOccupation"
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
        v-if="permissions"
        :permissions="permissions"
        :family-situation="familySituation"
        :major-children="majorChildren"
      />
    </div>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    saveBeneficiaryOccupationSchema,
    SaveBeneficiaryOccupationInput
  } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, Route } from '~/utils/routing'
  import type { MinimalBeneficiaryForFormLayout } from '~/types/beneficiary'
  import { prismaDecimalToNumber } from '~/utils/prisma'

  definePageMeta({
    name: Route.AppBeneficiaryEditOccupation
  })

  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  const route = useRoute()
  const beneficiaryId = route.params.id as string

  const { data, pending, error } =
    await trpcClient.beneficiary.getBeneficiaryDetails.useQuery({
      id: beneficiaryId
    })

  const permissions = computed(() => {
    if (!data.value) {
      return null
    }
    return data.value.permissions
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
      structureId: b.structureId,
      referents: b.referents,
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
    } as SaveBeneficiaryOccupationInput & MinimalBeneficiaryForFormLayout
  })

  function onSaveBeneficiary(
    beneficiary: SaveBeneficiaryOccupationInput,
    target: string | undefined
  ) {
    if (!data.value) {
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.updateOccupationIncome.mutate({
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
