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
          @click="onKeepConnect"
        >
          Poursuivre la navigation
        </button>
      </li>
      <li>
        <button
          class="fr-btn fr-btn--secondary"
          title="Se déconnecter"
          type="button"
          @click="onDisconnect"
        >
          Se déconnecter
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  const modal = useModal()

  const props = defineProps<{
    disconnect: () => void
    keepConnect: () => void
  }>()

  function onDisconnect() {
    props.disconnect()
    modal.close()
  }

  function onKeepConnect() {
    props.keepConnect()
    modal.close()
  }
</script>
