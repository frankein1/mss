<template>
  <div class="fr-grid-row">
    <div
      v-for="(entourage, index) in entourages || []"
      :key="entourage?.id"
      class="fr-col-12"
    >
      <hr
        v-if="index > 0"
        class="fr-col-12 fr-mt-5v"
      />
      <BeneficiaryInfoRelative :relative="entourage" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GetBeneficiaryRelative } from '~/server/route'

  defineProps<{
    entourages: GetBeneficiaryRelative[]
  }>()
</script>
