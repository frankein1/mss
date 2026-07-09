<template>
  <AtomAlert
    v-if="qpv"
    :alert-type="AlertType.Info"
    message="Quartier Prioritaire de la Ville"
  >
    <template #detailedMessage>
      <p>
        Un QPV a été détecté à cette adresse :
        <span class="fr-text--bold"
          >&laquo;&nbsp;{{ qpv.nom }}&nbsp;&raquo;</span
        >. Si nécessaire, vous pouvez reporter ces informations dans les champs
        ci-dessous.
      </p>
    </template>
  </AtomAlert>
</template>

<script setup lang="ts">
  import type { QpvFeatureProperties } from '~/composables/useQpvResolution'
  import { AlertType } from '~/utils/constants/alert'

  defineProps<{
    qpv: QpvFeatureProperties | null
  }>()
</script>
