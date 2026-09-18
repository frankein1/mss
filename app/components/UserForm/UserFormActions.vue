<template>
  <AtomActionsBar class="action-bar">
    <ul
      class="fr-btns-group fr-btns-group--icon-leftfr-btns-group--lg fr-btns-group--inline-md fr-btns-group--right"
    >
      <li v-if="userId && authUserId !== userId">
        <NuxtLink
          class="fr-btn fr-icon-delete-bin-6-line fr-btn--icon-left fr-btn--secondary btn-delete-action"
          :to="routes.structure.AppStructureUserDelete.path(userId)"
          >Supprimer l'utilisateur
        </NuxtLink>
      </li>
      <li>
        <button
          class="fr-btn fr-btn--secondary"
          type="button"
          @click="emit('cancel')"
        >
          Annuler
        </button>
      </li>
      <li>
        <button
          class="fr-btn submit-btn"
          type="submit"
          :data-submitting="isSubmitting"
          :disabled="isSubmitting"
          @click="emit('submit')"
        >
          Enregistrer
        </button>
      </li>
    </ul>
  </AtomActionsBar>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'

  const authState = useAuthState()
  const authUserId = authState.getUserId

  const { isSubmitting } = defineProps<{
    isSubmitting: boolean
    userId?: string
  }>()

  const emit = defineEmits<{
    submit: []
    cancel: []
  }>()
</script>

<style lang="scss" scoped>
  .action-bar {
    position: sticky;
    bottom: 0;
  }
</style>
