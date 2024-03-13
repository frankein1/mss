<template>
  <BeneficiaryEditFormLayout
    :draft="draft"
    :beneficiary-identification="beneficiaryIdentification"
    :schema="updateBeneficiaryOccupationSchema"
    :binded-values="bindedValues"
    :permissions="permissions"
    :is-submitting="isSubmitting"
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
      v-else-if="bindedValues && permissions"
      class="fr-p-3v"
    >
      <BeneficiaryFormOccupationIncome
        :permissions="permissions"
        :family-situation="familySituation"
        :major-children="majorChildren"
        :tax-household-members="taxHouseholdMembers"
      />
    </div>
  </BeneficiaryEditFormLayout>
</template>

<script lang="ts" setup>
  import {
    updateBeneficiaryOccupationSchema,
    UpdateBeneficiaryOccupationInput
  } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { RoutePath, Route } from '~/utils/routing'

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

  const bindedValues = computed(() => {
    if (!data.value) {
      return null
    }

    const {
      beneficiary: { id, structureId, occupationIncome }
    } = data.value

    return {
      id,
      structureId,
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
      otherMembersMainIncomeSource:
        occupationIncome?.otherMembersMainIncomeSource || [],
      otherMembersMainIncomeAmount: prismaDecimalToNumber(
        occupationIncome?.otherMembersMainIncomeAmount
      ),
      pensionOrganisations: occupationIncome?.pensionOrganisations || []
    }
  })
  const draft = computed(() => {
    if (!data.value) {
      return true
    }

    return data.value.beneficiary.draft
  })

  const beneficiaryIdentification = computed(() =>
    data.value
      ? {
          id: data.value.beneficiary.id,
          firstName: data.value.beneficiary.general.firstName,
          birthName: data.value.beneficiary.general.birthName,
          usualName: data.value.beneficiary.general.usualName,
          birthDate: data.value.beneficiary.general.birthDate
        }
      : null
  )

  const familySituation = computed(
    () => data.value?.beneficiary.taxHouseholds?.familySituation
  )
  const majorChildren = computed(
    () => data.value?.beneficiary.taxHouseholds?.majorChildren
  )

  const taxHouseholdMembers = computed(
    () => data.value?.beneficiary.taxHouseholds?.taxHouseholds || []
  )

  function onSaveBeneficiary(
    beneficiary: UpdateBeneficiaryOccupationInput,
    target: string | undefined
  ) {
    if (!data.value) {
      return
    }

    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.updateOccupationIncome.mutate(beneficiary),
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
