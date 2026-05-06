<template>
  <div>
    <p>
      Souhaitez-vous vraiment supprimer le modèle
      <strong>{{ templateName }}</strong> ? Cette action est irréversible.
    </p>

    <ul
      class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right fr-mt-2w"
    >
      <li>
        <button
          class="fr-btn fr-btn--secondary fr-mb-0"
          type="button"
          @click="modal.close()"
        >
          Annuler
        </button>
      </li>
      <li>
        <button
          class="fr-btn btn-delete-action fr-mb-0"
          type="button"
          @click="onConfirm"
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
    templateName: string
    onConfirm: () => void
  }>()
</script>
