<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-grid-row fr-grid-row--gutters">
      <p class="fr-col-12">
        L’objet ne sera plus proposé dans la liste des objets d’accompagnement
        des formulaires d’instructions de dossier et d’entretiens. Il sera
        conservé dans les pages statistiques et dans les filtres s’il a été
        utilisé dans au moins un accompagnement.
      </p>

      <div class="fr-col-12">
        <ul
          class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right fr-mt-3w"
        >
          <li>
            <button
              class="fr-btn fr-btn--secondary"
              type="button"
              @click="modal.close"
            >
              Annuler
            </button>
          </li>
          <li>
            <button
              class="fr-btn"
              type="submit"
              :submitting="isSubmitting"
              :disabled="isSubmitting"
            >
              Modifier
            </button>
          </li>
        </ul>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
  const modal = useModal()

  defineProps<{
    isSubmitting: boolean
  }>()

  const emit = defineEmits<{ delete: [] }>()

  function onSubmit() {
    emit('delete')
  }
</script>
