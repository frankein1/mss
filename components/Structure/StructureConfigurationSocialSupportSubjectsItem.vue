<template>
  <div class="sss-item">
    <div>{{ label }}</div>

    <div class="sss-item__actions">
      <div
        :id="`button-edit-${id}`"
        class="icon fr-icon-pencil-line"
        data-fr-opened="false"
        aria-controls="global-modal"
        :aria-describedby="`tooltip-edit-${id}`"
        title="Modifier"
        aria-label="Modifier"
        @click="$emit('edit')"
      ></div>
      <span
        :id="`tooltip-edit-${id}`"
        class="fr-tooltip fr-placement"
        role="tooltip"
        aria-hidden="true"
        >Modifier</span
      >

      <div
        :id="`button-remove-${id}`"
        class="icon fr-icon-close-circle-line"
        data-fr-opened="false"
        aria-controls="global-modal"
        :aria-describedby="`tooltip-remove-${id}`"
        title="Retirer"
        aria-label="Retirer"
        @click="$emit('remove')"
      ></div>
      <span
        :id="`tooltip-remove-${id}`"
        class="fr-tooltip fr-placement"
        role="tooltip"
        aria-hidden="true"
        >Retirer</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    id: string
    label: string
    canEdit: boolean
  }>()

  defineEmits<{
    edit: []
    remove: []
  }>()
</script>

<style scoped>
  .sss-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-height: 66px;
    padding: 20px 0;
    border-bottom: solid 1px var(--border-default-grey);
  }

  .sss-item__actions {
    display: flex;
    gap: 1rem;
  }

  .icon {
    color: var(--primary);
    cursor: pointer;
  }
</style>
