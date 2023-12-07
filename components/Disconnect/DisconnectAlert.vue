<template>
  <div class="fr-pt-2w">
    <ul
      class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left"
    >
      <li>
        <button
          class="fr-btn"
          title="Poursuivre la navigation"
          type="button"
          @click="keepConnect"
        >
          Poursuivre la navigation
        </button>
      </li>
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
    </ul>
  </div>
</template>

<script setup lang="ts">
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
