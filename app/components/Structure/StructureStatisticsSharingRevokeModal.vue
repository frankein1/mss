<template>
  <form
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <p>
          <strong>{{ name }}</strong> ne pourra plus consulter les statistiques
          de votre structure.
        </p>
        <p class="fr-text--sm text--muted fr-mb-0">
          Vous pourrez l'autoriser à nouveau plus tard si nécessaire.
        </p>
      </div>

      <div class="fr-col-12">
        <ul
          class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right fr-mt-2w"
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
              class="fr-btn btn-delete-action"
              type="submit"
              :disabled="isSubmitting"
            >
              Retirer l'accès
            </button>
          </li>
        </ul>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
  const modal = useModal()

  const props = defineProps<{
    name: string
    isSubmitting: boolean
    revoke: () => void
  }>()

  function onSubmit() {
    props.revoke()
  }
</script>
