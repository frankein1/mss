<template>
  <div>
    <p>
      La suppression du dispositif sera également effectuée sur le ou les suivis
      qui y ont été associé. Souhaitez-vous continuer ?
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
          Supprimer quand même
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  const modal = useModal()

  defineProps<{
    onConfirm: () => void
  }>()
</script>
