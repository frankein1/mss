<template>
  <section
    ref="debtsSection"
    class="feature-section fr-container fr-p-5w fr-mb-3w"
  >
    <a
      id="debts"
      href="#Debts"
      aria-hidden="true"
    ></a>
    <h2 class="fr-h2 primary">Dette(s)</h2>

    <DebtForm
      v-for="(field, idx) in fields"
      :key="field.key"
      :index="idx"
      @remove="remove(idx)"
    />

    <DsfrButton
      label="Ajouter une dette"
      type="button"
      icon="fr-icon-add-line"
      tertiary
      no-outline
      @click="push({ id: v4() })"
    />

    <section class="subtotal fr-h4 fr-mt-3w">
      <span>Sous-total dette(s)</span>
      <span class="primary euro-symbol">
        {{ total !== null ? euros(total) : '-' }}
      </span>
    </section>
  </section>
</template>

<script setup lang="ts">
  import { v4 } from 'uuid'
  import VueScrollTo from 'vue-scrollto'
  import { UpdateLoanOrDebtInput } from '~/server/schema'
  import { BeneficiaryBudgetSection } from '~/utils/constants/beneficiary'

  defineProps<{ total: number | null }>()

  const route = useRoute()

  const { fields, push, remove } = useFieldArray<UpdateLoanOrDebtInput>('debts')

  const debtsSection = ref<HTMLElement | null>(null)

  onMounted(() => {
    const section = route.hash.slice(1)

    console.log('section', section)

    if (debtsSection.value && section === BeneficiaryBudgetSection.Debts) {
      console.log('scroll to debts')
      VueScrollTo.scrollTo(debtsSection.value, 300, {
        easing: 'linear',
        offset: -50
      })
      // focusAndScrollTo(debtsSection.value)
    }
  })
</script>

<style scoped>
  .subtotal {
    display: flex;
    place-content: center space-between;
  }

  .primary {
    color: var(--primary);
  }
</style>
