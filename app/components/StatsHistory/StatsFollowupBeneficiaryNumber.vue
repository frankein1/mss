<template>
  <div class="feature-section fr-p-2w">
    <h4 class="fr-sr-only">Nombre de bénéficiaires concernés</h4>
    <StatsBeneficiaryNumber
      v-if="beneficiaryTotalCount"
      :beneficiary-counts="beneficiaryTotalCount"
      history-type="followup"
    />
    <p v-else>
      Commencez à créer des entretiens dans les fiches de bénéficiaires pour
      voir apparaître les statistiques du nombre de bénéficiaires concernés.
    </p>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{ beneficiaryTotalCount: number }>()
</script>

<style lang="scss" scoped>
  .feature-section {
    background-image: url('../../assets/icons/users-big-teal.svg');
    background-repeat: no-repeat;
    background-position: right 2rem bottom -2px;
  }

  h2 {
    word-break: normal;
    overflow-wrap: anywhere;
  }
</style>
