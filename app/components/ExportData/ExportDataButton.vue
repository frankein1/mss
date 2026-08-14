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
    {{ title || 'Exporter le tableau (.xlsx)' }}
  </button>
</template>

<script lang="ts" setup>
  import ExportDataConfirm from './ExportDataConfirm.vue'

  const modal = useModal()

  const {
    isDownloading,
    title = undefined,
    hasFilters = true,
    export: exportFn
  } = defineProps<{
    isDownloading: boolean
    title?: string
    hasFilters?: boolean
    export: (code: string) => Promise<void>
  }>()

  function exportConfirm() {
    modal.open(ExportDataConfirm, {
      title: 'Saisir un code de validation pour télécharger les données',
      size: 'lg',
      hasFilters: hasFilters,
      export: exportFn
    })
  }
</script>
