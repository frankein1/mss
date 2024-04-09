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
  import { RoutePath } from '~/utils/routing'
  import { CreateHouseholdMemberInput } from '~/server/schema'

  const props = defineProps<{ beneficiaryId: string; budgetId: string }>()

  const modal = useModal()
  const isSubmitting = ref(false)
  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()

  function onAddMember() {
    modal.open(BudgetIncomesAddMemberForm, {
      title: 'Ajouter les revenus d’un membre du foyer fiscal',
      beneficiaryId: props.beneficiaryId,
      budgetId: props.budgetId,
      add: addMember
    })
  }

  function addMember(values: CreateHouseholdMemberInput) {
    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.createTaxHouseholdMember.mutate(values),
      isSubmitting,
      onSuccess: ({ incomeId }) => {
        modal.close()
        navigateTo(
          RoutePath.AppBeneficiaryBudgetIncomeEdit(
            props.beneficiaryId,
            `${incomeId}`
          )
        )
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
