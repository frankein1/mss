<template>
  <h3 class="fr-col-12 fr-h5 fr-mb-0">Compte rendu</h3>

  <div class="fr-col-12">
    <VeeTextarea
      class="large-textarea"
      name="synthesis"
      :label="helpRequestFieldLabels.synthesis"
    />
  </div>

  <div
    v-if="canEditPrivateSynthesis"
    class="fr-col-12"
  >
    <VeeTextarea
      name="privateSynthesis"
      :label="helpRequestFieldLabels.privateSynthesis"
      label-icon="fr-icon-lock-line"
    >
      <template #hint>
        Le compte rendu privé est uniquement visible et modifiable par l'agent
        qui instruit le dossier.<br />{{ SENSITIVE_DATA_HINT }}
      </template>
    </VeeTextarea>
  </div>
</template>

<script setup lang="ts">
  import { helpRequestFieldLabels } from '~/client/labels/helpRequest.labels'
  import { SENSITIVE_DATA_HINT } from '~/utils/constants'

  defineProps<{
    canEditPrivateSynthesis: boolean
  }>()
</script>
