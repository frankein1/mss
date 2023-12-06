<template>
  <AtomAlert
    class="fr-mb-2w"
    :alert-type="AlertType.Warning"
    message=""
    detailed-message=""
  />
  <p>Vous allez être déconnecté.e dans 5 minutes</p>
  <ul class="fr-btns-group fr-btns-group--inline-md fr-mt-3w">
    <li>
      <button
        class="fr-btn fr-btn--secondary"
        title="Se déconnecter"
        type="button"
        @click="disconnect"
      >
        Se déconnecter
      </button>
    </li>
    <li>
      <button
        class="fr-btn btn-delete-action"
        title="Poursuivre la navigation"
        type="button"
        @click="keepConnect"
      >
        Poursuivre la navigation
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'

  const modal = useModal()

  const emit = defineEmits<{ disconnect: []; keepConnect: [] }>()

  function disconnect() {
    emit('disconnect')
    modal.close()
  }

  function keepConnect() {
    emit('keepConnect')
    modal.close()
  }
</script>
