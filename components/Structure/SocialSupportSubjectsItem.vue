<template>
  <div class="sss-item">
    <div>{{ label }}</div>

    <div class="sss-item__actions">
      <div
        :id="`button-edit-${id}`"
        :class="editClass"
        data-fr-opened="false"
        :aria-controls="editAriaControls"
        :aria-describedby="`tooltip-edit-${id}`"
        title="editTooltipLabel"
        aria-label="editTooltipLabel"
        @click="onEdit"
      ></div>
      <span
        :id="`tooltip-edit-${id}`"
        class="fr-tooltip fr-placement"
        role="tooltip"
        aria-hidden="true"
        >{{ editTooltipLabel }}</span
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
  const props = defineProps<{
    id: string
    label: string
    canEdit: boolean
    isDefault: boolean
  }>()

  const emit = defineEmits<{
    edit: []
    remove: []
  }>()

  const editTooltipLabel = computed(() => {
    if (props.isDefault) {
      return "Cette objet d'accompagnement n'est pas modifiable"
    }
    return 'Modifier'
  })

  const editClass = computed(() =>
    props.isDefault
      ? 'icon fr-icon-questionnaire-line'
      : 'icon fr-icon-pencil-line'
  )

  const editAriaControls = computed(() =>
    props.isDefault ? '' : 'global-modal'
  )

  const onEdit = () => {
    if (!props.isDefault) {
      emit('edit')
    }
  }
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
