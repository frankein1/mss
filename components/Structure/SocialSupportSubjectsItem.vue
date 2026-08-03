<template>
  <li class="sss-item">
    <p class="fr-mb-0">{{ label }}</p>
    <ul
      v-if="application.edit.structure"
      class="fr-btns-group fr-btns-group--inline"
    >
      <li>
        <button
          :id="`button-edit-${id}`"
          type="button"
          class="fr-btn fr-icon-edit-line fr-btn--tertiary-no-outline fr-m-0"
          data-fr-opened="false"
          :disabled="isDefault"
          aria-controls="global-modal"
          @click="onEdit"
        >
          {{ editLabel }}
        </button>
      </li>
      <li>
        <button
          :id="`button-remove-${id}`"
          type="button"
          class="fr-btn fr-icon-delete-bin-6-line fr-btn--tertiary-no-outline btn-delete-action fr-m-0"
          data-fr-opened="false"
          aria-controls="global-modal"
          @click="$emit('remove')"
        >
          Retirer
        </button>
      </li>
    </ul>
  </li>
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

  const editLabel = computed(() => {
    if (props.isDefault) {
      return "Cet objet d'accompagnement n'est pas modifiable"
    }
    return 'Modifier'
  })

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
</style>
