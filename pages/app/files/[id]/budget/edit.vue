<template>
  <AtomLazyComponent
    :pending="filePending || pending"
    :error="Boolean(fileError || error)"
    message="Les informations générales du budget n'ont pas pu être chargées."
  >
    <form
      v-if="familyFileIdentification && budget"
      ref="form"
      novalidate
      @submit.prevent="onSubmit"
    >
      <main class="content">
        <div class="fr-container fr-pb-2w">
          <AtomBreadcrumb
            :links="
              breadcrumbs.budget.AppFileBudgetInfoEdit(
                familyFileId,
                familyFileIdentification
              )
            "
          />

          <PageTitle
            :title="title"
            pictogram-path="/pictograms/money.svg"
          />

          <AtomAlert
            v-if="budget.legacyRemainingAfterExpenses && open"
            class="fr-mb-4w"
            closeable
            :alert-type="AlertType.Warning"
            message="Le reste à vivre a été remplacé par le calcul automatique"
            @close="open = false"
          >
            <template #detailedMessage>
              <p class="euro-symbol">
                Le montant précédemment renseigné était de
                {{ budget.legacyRemainingAfterExpenses }}
              </p>
            </template>
          </AtomAlert>

          <BudgetGeneralInformationForm />
        </div>
      </main>

      <BudgetActionBar
        :is-submitting="isSubmitting"
        @cancel="onCancel"
      />
    </form>
  </AtomLazyComponent>
</template>

<script lang="ts" setup>
  import { Prisma } from '@prisma/client'
  import { AlertType } from '~/utils/constants/alert'
  import {
    UpdateBudgetInfoInput,
    updateBudgetInfoSchema
  } from '~/server/schema'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'

  const route = useRoute()
  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const familyFileId = route.params.id as string

  const title = routes.budget.AppFileBudgetInfoEdit.title

  useHead({ title })

  definePageMeta({
    name: routes.budget.AppFileBudgetInfoEdit.name
  })

  const {
    familyFileIdentification,
    pending: filePending,
    error: fileError
  } = await useFamilyFileMinimalInfo(familyFileId)

  const {
    data: budget,
    pending,
    error
  } = await trpcClient.budget.getInfo.useQuery({ familyFileId })

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

  const budgetTabRoute = routes.file.AppFile.path(familyFileId, {
    tab: BeneficiaryTab.Budget,
    originPage: route.name as typeof routes.budget.AppFileBudgetInfoEdit.name
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
          'La mise à jour des informations générales du budget a échoué.',
          snackbar.focus()
        )
      }
    })
  })

  function onCancel() {
    navigateTo(budgetTabRoute)
  }

  const open = ref(true)
</script>
