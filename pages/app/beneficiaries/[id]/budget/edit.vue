<template>
  <AtomLoader
    v-if="beneficiaryPending"
    class="fr-mx-auto"
  />

  <AtomAlert
    v-else-if="beneficiaryError"
    :alert-type="AlertType.Error"
    message="Le bénéficiaire n'a pas pu être chargé."
  />

  <form
    v-else-if="beneficiary"
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <main class="content">
      <div class="fr-container fr-pb-2w">
        <DsfrBreadcrumb
          :links="
            Breadcrumb.AppBeneficiaryBudgetInfoEdit(beneficiaryIdentification)
          "
        />
        <PageTitle
          :title="title"
          pictogram-path="/pictograms/money.svg"
        />

        <AtomLoader
          v-if="pending"
          class="fr-mx-auto"
        />

        <AtomAlert
          v-else-if="error"
          :alert-type="AlertType.Error"
          message="Les informations générales du budget n'ont pas pu être chargées."
        />

        <template v-else-if="budget">
          <AtomAlert
            v-if="budget.legacyRemainingAfterExpenses"
            class="fr-mb-4w"
            :alert-type="AlertType.Warning"
            message="Le reste à vivre a été remplacé par le calcul automatique"
          >
            <template #detailedMessage>
              <p class="euro-symbol">
                Le montant précédemment renseigné était de
                {{ budget.legacyRemainingAfterExpenses }}
              </p>
            </template>
          </AtomAlert>

          <BudgetGeneralInformationForm />
        </template>
      </div>
    </main>

    <BudgetActionBar
      :is-submitting="isSubmitting"
      @cancel="onCancel"
    />
  </form>
</template>

<script lang="ts" setup>
  import { Prisma } from '@prisma/client'
  import { AlertType } from '~/utils/constants/alert'
  import { Breadcrumb, RouteTitle, RoutePath, Route } from '~/utils/routing'
  import {
    UpdateBudgetInfoInput,
    updateBudgetInfoSchema
  } from '~/server/schema'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'

  const route = useRoute()
  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const beneficiaryId = route.params.id as string

  const title = RouteTitle.AppBeneficiaryBudgetInfoEdit()

  useHead({ title })

  definePageMeta({
    name: Route.AppBeneficiaryBudgetInfoEdit
  })

  const {
    data: beneficiary,
    pending: beneficiaryPending,
    error: beneficiaryError
  } = await trpcClient.beneficiary.getBeneficiaryMinimalInfo.useQuery({
    id: beneficiaryId
  })

  const {
    data: budget,
    pending,
    error
  } = await trpcClient.budget.getInfo.useQuery({ beneficiaryId })

  const beneficiaryIdentification = computed(() =>
    beneficiary.value
      ? {
          id: beneficiary.value.id,
          firstName: beneficiary.value.firstName,
          birthName: beneficiary.value.birthName,
          usualName: beneficiary.value.usualName,
          birthDate: beneficiary.value.birthDate
        }
      : null
  )

  const form = ref<HTMLFormElement | null>(null)
  const isSubmitting = ref(false)

  function getRemainingAfterExpenses(
    deltaIncomeExpenses: number | null | undefined,
    nMembers: number | Prisma.Decimal | null | undefined
  ) {
    const nm =
      typeof nMembers === 'number' ? nMembers : prismaDecimalToNumber(nMembers)
    return deltaIncomeExpenses === null ||
      deltaIncomeExpenses === undefined ||
      nm === null ||
      nm === undefined ||
      nm === 0
      ? null
      : deltaIncomeExpenses / nm
  }

  const { handleSubmit, meta, setValues, values } =
    useForm<UpdateBudgetInfoInput>({
      validationSchema: toTypedSchema(updateBudgetInfoSchema),
      initialValues: {
        id: budget.value?.id || '',
        numberHouseholdMembers: prismaDecimalToNumber(
          budget.value?.numberHouseholdMembers
        ),
        remainingAfterExpenses: getRemainingAfterExpenses(
          budget.value?.deltaIncomeExpenses,
          budget.value?.numberHouseholdMembers
        ),
        savings: prismaDecimalToNumber(budget.value?.savings),
        overdraft: prismaDecimalToNumber(budget.value?.overdraft),
        banqueDeFrance: prismaDecimalToNumber(budget.value?.banqueDeFrance),
        familyQuotient: prismaDecimalToNumber(budget.value?.familyQuotient)
      }
    })

  const numberHouseholdMembers = computed(() => values.numberHouseholdMembers)

  watch(numberHouseholdMembers, () => {
    const remainingAfterExpenses = getRemainingAfterExpenses(
      budget.value?.deltaIncomeExpenses,
      numberHouseholdMembers.value
    )
    setValues({
      remainingAfterExpenses: remainingAfterExpenses
        ? parseFloat(remainingAfterExpenses.toFixed(2))
        : null
    })
  })

  const isFormDirty = computed(() => meta.value.dirty)

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty
  })

  const budgetTabRoute = RoutePath.AppBeneficiary(beneficiaryId, {
    tab: BeneficiaryTab.Budget,
    originPage: route.name as Route.AppBeneficiaryBudgetInfoEdit
  })

  const onSubmit = handleSubmit(async values => {
    isNavigatingWithFormActions.value = true

    await useTrpcMutation({
      mutation: () => trpcClient.budget.updateInfo.mutate(values),
      onSuccess: () => {
        navigateTo(budgetTabRoute)
        snackbar.success(
          'Informations générales du budget mises à jour avec succès'
        )
      },
      onFailure: () => {
        snackbar.error(
          'La mise à jour des informations générales du budget a échoué.'
        )
      }
    })
  })

  function onCancel() {
    navigateTo(budgetTabRoute)
  }
</script>
