<template>
  <section
    class="fr-grid-row fr-grid-row--gutters feature-section fr-mb-2w fr-mt-2w"
  >
    <div class="col-12">
      <h2 class="fr-text--sm fr-text--bold uppercase">Description</h2>
    </div>
    <div class="fr-col-12">
      <VeeInput
        type="text"
        :label="workshopLabels.subTitle"
        hint="À remplir uniquement si vous avez besoin de différencier plusieurs séances d’un même atelier"
        name="subTitle"
        :disabled="pending"
      />
    </div>
    <div class="fr-col-12">
      <VeeTextarea
        :label="workshopLabels.description"
        name="description"
        :disabled="pending"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { workshopLabels } from '~/client/labels'

  defineProps<{
    isSubmitting: boolean
    pending: boolean
  }>()
</script>
