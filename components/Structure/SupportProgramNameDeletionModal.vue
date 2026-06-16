<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-grid-row fr-grid-row--gutters">
      <p class="fr-col-12">
        Voulez-vous vraiment supprimer le dispositif « {{ name }} » ?
      </p>

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
              class="fr-btn"
              type="submit"
              :disabled="isSubmitting"
              :data-submitting="isSubmitting"
            >
              Valider
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
    delete: () => void
  }>()

  function onSubmit() {
    props.delete()
  }
</script>
