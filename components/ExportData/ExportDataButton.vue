<template>
  <button
    :disabled="isDownloading"
    data-fr-opened="false"
    aria-controls="global-modal"
    class="fr-btn fr-btn--secondary fr-btn--icon-left"
    :class="{ 'fr-icon-download-line': !isDownloading }"
    @click="exportConfirm"
  >
    <AtomLoader
      v-if="isDownloading"
      :diameter="25"
      border-color="var(--text-disabled-grey)"
      class="fr-mr-1w"
    />
    Télécharger les données
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
      'Confirmation du téléchargement',
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
