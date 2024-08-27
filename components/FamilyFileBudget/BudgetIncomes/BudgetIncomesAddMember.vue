<template>
  <div class="label">
    Les membres du foyer fiscal affichés ici dépendent des informations saisies
    dans le formulaire du bénéficiaire
  </div>

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

  const props = defineProps<{
    familyFileId: string
    budgetId: string
  }>()

  const modal = useModal()
  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()

  const isSubmitting = ref(false)

  function onAddMember() {
    modal.open(BudgetIncomesAddMemberForm, {
      title: 'Ajouter les revenus d’un membre du foyer fiscal',
      isSubmitting: isSubmitting.value,
      budgetId: props.budgetId,
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
      onFailure: () => {
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
