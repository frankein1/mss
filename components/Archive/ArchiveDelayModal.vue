<template>
  <p>
    Sans nouvelle activité sur le dossier, un prochain rappel pour vous inviter
    à le supprimer sera envoyé dans 1 an. Si vous réalisez une action sur le
    dossier, alors il sera réactivé pour 2 ans.
  </p>
  <AtomAlertMSS
    :alert-type="AlertType.Info"
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
    @click="cancel()"
  >
    Cancel
  </button>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  const modal = useModal()

  const cancel = () => {
    modal.close()
  }
</script>
