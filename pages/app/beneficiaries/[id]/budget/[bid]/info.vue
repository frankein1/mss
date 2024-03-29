<template>
  <AtomLoader
    v-if="beneficiaryPending"
    class="fr-mx-auto"
    @submit.prevent="onSubmit"
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
            Breadcrumb.AppBeneficiaryBudgetInfo(
              beneficiaryIdentification,
              budgetId
            )
          "
        />
        <PageTitle
          :title="title"
          pictogram="/pictograms/money.svg"
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

        <BudgetGeneralInformationForm v-else-if="budget" />
      </div>
    </main>

    <div class="actions-bar bg-color-white">
      <ul
        class="fr-btns-group fr-btns-group--lg fr-btns-group--inline-md fr-btns-group--right"
      >
        <li>
          <button
            class="fr-btn fr-btn--secondary"
            type="button"
            @click="() => {}"
          >
            Annuler
          </button>
        </li>

        <li>
          <button
            class="fr-btn submit-btn"
            type="submit"
            :submitting="isSubmitting"
            :disabled="isSubmitting"
          >
            Enregistrer
          </button>
        </li>

        <li>
          <button
            class="fr-btn submit-btn"
            type="submit"
            :submitting="isSubmitting"
            :disabled="isSubmitting"
          >
            Enregistrer et quitter
          </button>
        </li>
      </ul>
    </div>
  </form>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import { Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'
  import {
    UpdateBudgetInfoInput,
    updateBudgetInfoSchema
  } from '~/server/schema'
  import { prismaDecimalToNumber } from '~/utils/prisma'
  const route = useRoute()
  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const budgetId = route.params.bid as string
  const beneficiaryId = route.params.id as string

  const title = RouteTitle.AppBeneficiaryBudgetInfo()

  useHead({ title })

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
  } = await trpcClient.budget.getInfo.useQuery({
    id: budgetId
  })

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

  const { handleSubmit, meta } = useForm<UpdateBudgetInfoInput>({
    validationSchema: toTypedSchema(updateBudgetInfoSchema),
    initialValues: {
      id: budgetId,
      remainingAfterExpenses: prismaDecimalToNumber(
        budget.value?.remainingAfterExpenses
      ),
      savings: prismaDecimalToNumber(budget.value?.savings),
      overdraft: prismaDecimalToNumber(budget.value?.overdraft),
      familyQuotient: prismaDecimalToNumber(budget.value?.familyQuotient)
    }
  })

  const isFormDirty = computed(() => meta.value.dirty)

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty
  })

  const onSubmit = handleSubmit(async values => {
    isNavigatingWithFormActions.value = true

    await useTrpcMutation({
      mutation: () => trpcClient.budget.updateInfo.mutate(values),
      onSuccess: () => {
        navigateTo(RoutePath.AppBeneficiary(beneficiaryId))
        snackbar.success(
          'Informations générales du budget mises à jour avec succès'
        )
      },
      onFailure: () => {
        snackbar.error(
          'La mise a jour des informations générales du budget a échoué.'
        )
      }
    })
  })
</script>

<style scoped lang="scss">
  @use '~/assets/style/variables' as *;

  $actions-bar-height: 6.0625rem;

  .content {
    height: calc(100vh - #{$actions-bar-height} - #{$top-bar-height});
    overflow-y: auto;
  }

  .actions-bar {
    border-top: 1px solid var(--background-default-grey);
    padding: 1.5rem 2rem;
  }

  .fr-btns-group .fr-btn {
    margin-bottom: 0;
  }
</style>
