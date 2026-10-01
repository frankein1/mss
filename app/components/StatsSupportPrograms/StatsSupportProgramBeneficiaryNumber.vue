<template>
  <div class="feature-section fr-p-6v">
    <h4 class="fr-sr-only">Nombre de bénéficiaires concernés</h4>
    <StatsBeneficiaryNumber
      v-if="beneficiaryTotalCount"
      :beneficiary-counts="beneficiaryTotalCount"
      history-type="supportprogram"
    />
    <p v-else>
      Aucun bénéficiaire n’a de dispositif correspondant aux filtres
      sélectionnés.
    </p>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{ beneficiaryTotalCount: number }>()
</script>

<style lang="scss" scoped>
  .feature-section {
    background-image: url('../../assets/icons/users-big-blue.svg');
    background-repeat: no-repeat;
    background-position: right 2rem bottom -2px;
  }
</style>
