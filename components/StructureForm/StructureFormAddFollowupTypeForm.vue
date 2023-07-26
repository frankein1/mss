<template>
  <form
    ref="form"
    class="fr-container--fluid"
    @submit="onCreateFollowupType"
  >
    <div
      class="fr-grid-row fr-grid-row--gutters form-grid follow-up-type-form-row"
    >
      <VeeInput
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
  import type { CreateCustomFollowupTypeInput } from '~/server/schema'
  import { createCustomFollowupTypeSchema } from '~/server/schema'
  import { followupTypeFieldLabels } from '~/client/labels'

  const emit = defineEmits<{
    createFollowupType: [followupTypeName: string]
  }>()

  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit } = useForm<CreateCustomFollowupTypeInput>({
    validationSchema: toTypedSchema(createCustomFollowupTypeSchema)
  })

  const onCreateFollowupType = handleSubmit(({ name }) => {
    emit('createFollowupType', name)
    form.value?.reset()
  })
</script>

<style scoped>
  .follow-up-type-form-row {
    align-items: center;
  }
</style>
