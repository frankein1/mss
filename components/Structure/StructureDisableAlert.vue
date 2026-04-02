<template>
  <div class="partner-alert">
    <p class="fr-m-0">
      La structure sera désactivée et les bénéficiaires rattachés anonymisés.
    </p>
    <p class="fr-m-0"><strong>Cette action est irréversible</strong>.</p>
    <p class="fr-m-0">
      Assurez-vous que vous souhaitez-bien désactiver la structure :
      <strong>{{ structure.name }}</strong
      >.
    </p>
    <AtomAlert
      v-if="!canBeDisabled(structure)"
      :alert-type="AlertType.Warning"
      message="La structure a eu une activité dans les six derniers mois. Vous ne pouvez donc pas la désactiver."
    ></AtomAlert>
    <div class="button-bar">
      <button
        class="fr-btn fr-btn--icon-left fr-icon-delete-line delete"
        title="Désactiver"
        :disabled="!canBeDisabled(structure)"
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
  import { canBeDisabled } from '~/utils/structure'
  import type { StructureInfo } from './types'
  import { AlertType } from '~/utils/constants/alert'

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
    gap: 0.5rem;
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
