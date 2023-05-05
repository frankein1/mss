<template>
  <form
    class="fr-container--fluid"
    @submit.prevent="onCreateFollowupType"
  >
    <div
      class="fr-grid-row fr-grid-row--gutters form-grid follow-up-type-form-row"
    >
      <AtomInput
        name="name"
        :label="followupTypeFieldLabels.name + ' de la nouvelle aide'"
        required
      />

      <div class="fr-col-3">
        <button
          class="fr-btn fr-btn--sm"
          type="submit"
        >
          Ajouter
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
  import { CreateCustomFollowupTypeInput } from '~/server/schema'
  import { followupTypeFieldLabels } from '~/client/labels/followup-type.labels'

  const emit = defineEmits<{
    (e: 'createFollowupType', followupTypeName: string): void
  }>()

  function onCreateFollowupType(event: Event) {
    const { data, form } = useFormData<CreateCustomFollowupTypeInput>(event)
    emit('createFollowupType', data.name)
    form.reset()
  }
</script>

<style scoped>
  .follow-up-type-form-row {
    align-items: center;
  }
</style>
