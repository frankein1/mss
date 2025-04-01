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
    Exporter le tableau (.xlsx)
  </button>
</template>

<script lang="ts" setup>
  import ExportDataConfirm from './ExportDataConfirm.vue'

  const modal = useModal()

  const emit = defineEmits<{ export: [code: string] }>()

  defineProps<{ isDownloading: boolean }>()

  function exportConfirm() {
    modal.open(ExportDataConfirm, {
      title: 'Attention aux données des bénéficiaires',
      export: (code: string) => emit('export', code)
    })
  }
</script>
