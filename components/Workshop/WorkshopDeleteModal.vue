<template>
  <div class="">
    <p>
      Souhaitez-vous vraiment supprimer l'atelier ainsi que les participants et
      participantes qui ont été ajoutés ?
      <br />
      Toute suppression est définitive.
    </p>

    <ul
      class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right fr-mt-2w"
    >
      <li>
        <button
          class="fr-btn fr-btn--secondary fr-mb-0"
          type="button"
          @click="modal.close"
        >
          Annuler
        </button>
      </li>
      <li>
        <button
          class="fr-btn btn-delete-action fr-mb-0"
          type="button"
          @click="onDelete"
        >
          Supprimer
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  const modal = useModal()

  defineProps<{
    onDelete: () => void
  }>()
</script>
