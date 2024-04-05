<template>
  <form
    novalidate
    @submit.prevent="onLeave"
  >
    <p>
      Souhaitez-vous quitter la page sans enregistrer les informations saisies ?
    </p>
    <ul class="fr-btns-group fr-btns-group--inline-md fr-mt-3w">
      <li>
        <button
          class="fr-btn fr-btn--secondary"
          type="button"
          @click="onCancel"
        >
          Annuler
        </button>
      </li>
      <li>
        <button
          class="fr-btn"
          type="submit"
        >
          Quitter sans enregistrer
        </button>
      </li>
    </ul>
  </form>
</template>

<script setup lang="ts">
  const modal = useModal()

  const props = defineProps<{ cancel: () => void; leave: () => void }>()

  function onCancel() {
    modal.close()
    props.cancel()
  }

  function onLeave() {
    modal.close()
    props.leave()
  }
</script>
