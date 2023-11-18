<template>
  <BeneficiaryEditFormLayout
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
      v-else-if="beneficiary && permissions"
      class="fr-p-3v"
    >
      <BeneficiaryFormOccupationIncome
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

  const permissions = computed(() => data.value?.permissions)

  const familySituation = computed(
    () => data.value?.beneficiary.taxHouseholds?.familySituation
  )
  const majorChildren = computed(
    () => data.value?.beneficiary.taxHouseholds?.majorChildren
  )

  const beneficiary = computed(() => {
    if (!data.value) {
      return null
    }

    const {
      beneficiary: { id, structureId, referents, general, occupationIncome }
    } = data.value

    // Names and id are required for building the breadcrumb in the layout
    return {
      id,
      structureId,
      referents,
      firstName: general.firstName,
      usualName: general.usualName,
      birthName: general.birthName,
      ...occupationIncome,
      mainIncomeSource: occupationIncome?.mainIncomeSource || [],
      mainIncomeAmount: prismaDecimalToNumber(
        occupationIncome?.mainIncomeAmount
      ),
      partnerMainIncomeSource: occupationIncome?.partnerMainIncomeSource || [],
      partnerMainIncomeAmount: prismaDecimalToNumber(
        occupationIncome?.partnerMainIncomeAmount
      ),
      majorChildrenMainIncomeSource:
        occupationIncome?.majorChildrenMainIncomeSource || [],
      majorChildrenMainIncomeAmount: prismaDecimalToNumber(
        occupationIncome?.majorChildrenMainIncomeAmount
      ),
      incomes: occupationIncome?.incomes || [],
      pensionOrganisations: occupationIncome?.pensionOrganisations || []
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
