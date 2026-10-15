<template>
  <li class="spn-item">
    <p class="fr-mb-0">
      {{ label }}
      <span
        v-if="hasLifecycle"
        class="fr-badge fr-badge--sm fr-badge--info fr-badge--no-icon fr-ml-1w"
      >
        Avec Dates
      </span>
    </p>
    <ul
      v-if="application.edit.structure"
      class="fr-btns-group fr-btns-group--inline"
    >
      <li>
        <button
          :id="`button-edit-spn-${id}`"
          type="button"
          class="fr-btn fr-icon-edit-line fr-btn--tertiary-no-outline fr-m-0"
          data-fr-opened="false"
          aria-controls="global-modal"
          @click="$emit('edit')"
        >
          Modifier
        </button>
      </li>
      <li>
        <button
          :id="`button-remove-spn-${id}`"
          type="button"
          class="fr-btn fr-icon-delete-bin-6-line fr-btn--tertiary-no-outline btn-delete-action fr-m-0"
          data-fr-opened="false"
          aria-controls="global-modal"
          @click="$emit('remove')"
        >
          Supprimer
        </button>
      </li>
    </ul>
  </li>
</template>

<script setup lang="ts">
  defineProps<{
    id: string
    label: string
    hasLifecycle: boolean
  }>()

  defineEmits<{
    edit: []
    remove: []
  }>()

  const { application } = usePermissions()
</script>

<style lang="scss" scoped>
  .spn-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    border-bottom: solid 1px var(--border-default-grey);

    ul {
      flex-wrap: nowrap;
    }
  }
</style>
