<template>
  <section
    class="fr-grid-row fr-grid-row--gutters feature-section fr-mb-2w fr-mt-2w"
  >
    <div class="fr-col-12">
      <h2 class="fr-text--sm fr-text--bold text--uppercase fr-mb-1v">
        Description
      </h2>
    </div>
    <div class="fr-col-12">
      <VeeInput
        type="text"
        :label="workshopLabels.sessionName"
        hint="À remplir uniquement si vous avez besoin de différencier plusieurs séances d’un même atelier"
        name="sessionName"
        :disabled="isSubmitting"
      />
    </div>
    <div class="fr-col-12">
      <VeeTextarea
        :label="workshopLabels.description"
        placeholder=" Ex : Matériel, programme, gratuité, etc..."
        name="description"
        :disabled="isSubmitting"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { workshopLabels } from '~/client/labels'

  defineProps<{
    isSubmitting: boolean
  }>()
</script>
