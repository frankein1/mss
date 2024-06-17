<template>
  <div class="partner-alert">
    <div class="fr-text--md">
      La structure sera désactivée et les bénéficiaires rattachés anonymisées.
      Cette action est irreversible
    </div>
    <div class="button-bar">
      <button
        class="fr-btn fr-btn--icon-left fr-icon-delete-line delete"
        title="Désactiver"
        type="button"
        @click="onFinish"
      >
        Désactiver
      </button>
      <button
        class="fr-btn fr-btn--secondary"
        title="Annuler"
        type="button"
        @click="onCancel"
      >
        Annuler
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { StructureInfo } from './types'

  const props = defineProps<{
    structure: StructureInfo
    finish: (id: string) => void
    cancel: () => void
  }>()

  function onCancel() {
    props.cancel()
  }
  function onFinish() {
    props.finish(props.structure.id)
  }
</script>

<style lang="scss" scoped>
  .partner-alert {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .button-bar {
    display: flex;
    flex-direction: row-reverse;
    gap: 1rem;

    .delete {
      background-color: var(--text-default-error);
    }
  }
</style>
