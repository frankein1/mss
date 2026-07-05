<template>
  <li class="spn-item">
    <div>{{ label }}</div>

    <div
      v-if="application.edit.structure"
      class="spn-item__actions"
    >
      <button
        :id="`button-edit-spn-${id}`"
        class="icon fr-icon-pencil-line"
        data-fr-opened="false"
        aria-controls="global-modal"
        :aria-describedby="`tooltip-edit-spn-${id}`"
        aria-label="Modifier"
        @click="$emit('edit')"
      >
        <span
          :id="`tooltip-edit-spn-${id}`"
          class="fr-tooltip fr-placement"
          aria-hidden="true"
        >
          Modifier
        </span>
      </button>

      <button
        :id="`button-remove-spn-${id}`"
        class="icon fr-icon-close-circle-line"
        data-fr-opened="false"
        aria-controls="global-modal"
        :aria-describedby="`tooltip-remove-spn-${id}`"
        aria-label="Supprimer"
        @click="$emit('remove')"
      >
        <span
          :id="`tooltip-remove-spn-${id}`"
          class="fr-tooltip fr-placement"
          aria-hidden="true"
        >
          Supprimer
        </span>
      </button>
    </div>
  </li>
</template>

<script setup lang="ts">
  defineProps<{
    id: string
    label: string
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
    max-height: 66px;
    padding: 20px 0;
    border-bottom: solid 1px var(--border-default-grey);
  }

  .spn-item__actions {
    display: flex;
    gap: 0.5rem;
  }

  .icon {
    color: var(--primary);
    cursor: pointer;
  }
</style>
