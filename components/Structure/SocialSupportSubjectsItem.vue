<template>
  <div class="sss-item">
    <div>{{ label }}</div>

    <div
      v-if="application.edit.structure"
      class="sss-item__actions"
    >
      <button
        :id="`button-edit-${id}`"
        :class="editClass"
        data-fr-opened="false"
        :aria-controls="editAriaControls"
        :aria-describedby="`tooltip-edit-${id}`"
        aria-label="editTooltipLabel"
        @click="onEdit"
      >
        <span
          :id="`tooltip-edit-${id}`"
          class="fr-tooltip fr-placement"
          aria-hidden="true"
        >
          {{ editTooltipLabel }}
        </span>
      </button>

      <button
        :id="`button-remove-${id}`"
        class="icon fr-icon-close-circle-line"
        data-fr-opened="false"
        aria-controls="global-modal"
        :aria-describedby="`tooltip-remove-${id}`"
        aria-label="Retirer"
        @click="$emit('remove')"
      >
        <span
          :id="`tooltip-remove-${id}`"
          class="fr-tooltip fr-placement"
          aria-hidden="true"
          >Retirer</span
        >
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    id: string
    label: string
    isDefault: boolean
  }>()

  const emit = defineEmits<{
    edit: []
    remove: []
  }>()

  const { application } = usePermissions()

  const editTooltipLabel = computed(() => {
    if (props.isDefault) {
      return "Cet objet d'accompagnement n'est pas modifiable"
    }
    return 'Modifier'
  })

  const editClass = computed(() =>
    props.isDefault
      ? 'icon fr-icon-pencil-line edit--disabled'
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

<style lang="scss" scoped>
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
    gap: 0.5rem;
  }

  .icon {
    color: var(--primary);
    cursor: pointer;
  }

  .edit--disabled {
    color: var(--text-disabled-grey);
    cursor: default;
  }
</style>
