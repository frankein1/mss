<template>
  <div>
    <AtomAlertMSS
      :alert-type="AlertType.Warning"
      message="L’action ne pourra pas être annulée et aucune archive ne sera réalisée"
    >
      <template #detailedMessage>
        <p>
          L’ensemble des données relatives au dossier seront définitivement
          supprimées de Mon Suivi Social. Le dossier et ses accompagnements ne
          seront plus comptabilisés dans les statistiques.
        </p>
      </template>
    </AtomAlertMSS>
    <button
      class="fr-btn btn-delete-action fr-btn--icon-left fr-icon-delete-line fr-mb-0 edit-btn fr-mt-4w"
      type="button"
      @click="onDelete()"
    >
      Supprimer dénitivement
    </button>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'

  const emit = defineEmits<{
    deleteFile: []
  }>()

  const onDelete = () => {
    emit('deleteFile')
  }
</script>
