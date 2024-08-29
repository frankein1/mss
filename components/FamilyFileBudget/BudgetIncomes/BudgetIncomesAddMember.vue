<template>
  <div class="action fr-mt-2w">
    <button
      data-fr-opened="false"
      aria-controls="global-modal"
      type="button"
      class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-btn--md fr-icon-add-line"
      @click="onAddMember"
    >
      Ajouter les revenus d'un membre du foyer
    </button>
  </div>
</template>

<script setup lang="ts">
  import BudgetIncomesAddMemberForm from './BudgetIncomesAddMemberForm.vue'
  import { routes } from '~/utils/routes'
  import { CreateBudgetIncomeInput } from '~/server/schema'
  import { BeneficiaryFileIdentification } from '~/types/beneficiary'

  const props = defineProps<{
    familyFileId: string
    budgetId: string
    familyFileIdentification: BeneficiaryFileIdentification[]
  }>()

  const modal = useModal()
  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  function onAddMember() {
    modal.open(BudgetIncomesAddMemberForm, {
      title: 'Ajouter les revenus d’un membre du foyer',
      isSubmitting: isSubmitting.value,
      budgetId: props.budgetId,
      familyFileIdentification: props.familyFileIdentification,
      add: addMember
    })
  }

  function addMember(values: CreateBudgetIncomeInput) {
    useTrpcMutation({
      mutation: () => trpcClient.budget.createBudgetIncome.mutate(values),
      isSubmitting,
      onSuccess: ({ id }) => {
        modal.close()
        navigateTo(
          routes.budget.AppFileBudgetIncomeEdit.path(
            props.familyFileId,
            `${id}`
          )
        )
        snackbar.success('Membre du foyer créé avec succès.')
      },
      onFailure: e => {
        console.log(e)
        snackbar.error('La création du membre du foyer a échoué.')
      }
    })
  }
</script>

<style scoped>
  .label {
    text-align: center;
  }

  .action {
    display: flex;
    justify-content: center;
  }
</style>
