<template>
  <button
    :disabled="isDownloading"
    data-fr-opened="false"
    aria-controls="global-modal"
    class="fr-link fr-link--icon-left"
    :class="{
      'fr-icon-download-line': !isDownloading,
      'btn-loading': isDownloading
    }"
    @click="exportConfirm"
  >
    Exporter le tableau (.xlsx)
  </button>
</template>

<script lang="ts" setup>
  import ExportDataConfirm from './ExportDataConfirm.vue'

  const modal = useModal()

  const emit = defineEmits<{ (e: 'export'): void }>()

  defineProps<{
    isDownloading: boolean
  }>()

  function exportConfirm() {
    modal.open(
      "Confirmer l'export du tableau",
      ExportDataConfirm,
      {},
      { export: onExport }
    )
  }

  function onExport() {
    emit('export')
    modal.close()
  }
</script>
