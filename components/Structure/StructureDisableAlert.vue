<template>
  <div class="partner-alert">
    <AtomAlert
      v-if="!canBeDisabled(structure)"
      :alert-type="AlertType.Warning"
      :message="`La structure a eu une activité dans les six derniers mois (dernière date d'activité ${formatDateToLocalTimezone(structure.lastAccess || structure.created)}). Vous ne pouvez donc pas la désactiver.`"
    ></AtomAlert>
    <template v-else>
      <p class="fr-m-0">Cette structure sera désactivée.</p>
      <p class="fr-m-0">
        Les bénéficiaires et leurs accompagnements seront anonymisés. Les
        éléments suivants seront supprimés : notifications, commentaires,
        documents, budget, ateliers.
      </p>
      <p class="fr-m-0">Les comptes utilisateurs seront anonymisés.</p>
      <p class="fr-m-0"><strong>Cette action est irréversible</strong>.</p>
      <p class="fr-m-0">
        Assurez-vous que vous souhaitez-bien désactiver la structure :
        <strong>{{ structure.name }}</strong
        >.
      </p>
    </template>
    <div class="button-bar">
      <button
        class="fr-btn fr-btn--icon-left fr-icon-delete-line btn-delete-action"
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
  }
</style>
