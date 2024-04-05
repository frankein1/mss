<template>
  <button
    :disabled="isDownloading"
    data-fr-opened="false"
    aria-controls="global-modal"
    class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left"
    :class="{
      'fr-icon-download-line': !isDownloading,
      'btn-loading': isDownloading
    }"
    @click="exportConfirm"
  >
    Exporter {{ stats ? 'les statistiques' : 'le tableau' }} (.xlsx)
  </button>
</template>

<script lang="ts" setup>
  import ExportDataConfirm from './ExportDataConfirm.vue'

  const modal = useModal()

  const emit = defineEmits<{ export: [] }>()

  withDefaults(
    defineProps<{
      isDownloading: boolean
      stats?: boolean
    }>(),
    {
      stats: false
    }
  )

  function exportConfirm() {
    modal.open(ExportDataConfirm, {
      title: "Confirmer l'export du tableau",
      export: onExport
    })
  }

  function onExport() {
    emit('export')
    modal.close()
  }
</script>
