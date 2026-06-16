<template>
  <li class="spn-item">
    <form
      class="spn-item__form"
      novalidate
      @submit.prevent="onSubmit"
    >
      <VeeInput
        name="name"
        :label="supportProgramExportFieldLabels.supportProgramName"
        no-hint
        class="spn-item__field"
      />

      <div
        v-if="canEdit"
        class="spn-item__actions"
      >
        <button
          class="fr-btn fr-btn--secondary"
          type="submit"
        >
          Valider
        </button>

        <button
          class="fr-btn fr-btn--secondary fr-icon-delete-line btn-delete-action"
          data-fr-opened="false"
          aria-controls="global-modal"
          type="button"
          @click="emit('remove')"
        >
          Supprimer
        </button>
      </div>
    </form>
  </li>
</template>

<script setup lang="ts">
  import { z } from 'zod'
  import { supportProgramExportFieldLabels } from '~/client/labels'
  import { requiredStringConstraint } from '~/server/schema'
  import { maxStringLengthMessage } from '~/utils/zod'

  const props = defineProps<{
    name: string
    canEdit: boolean
  }>()

  const emit = defineEmits<{
    update: [name: string]
    remove: []
  }>()

  // TODO: schema à créer avec routes backend
  const { handleSubmit, setValues } = useForm({
    validationSchema: toTypedSchema(
      z.object({
        name: requiredStringConstraint.max(200, maxStringLengthMessage(200))
      })
    ),
    initialValues: { name: props.name }
  })

  watch(
    () => props.name,
    value => setValues({ name: value })
  )

  const onSubmit = handleSubmit(values => {
    emit('update', values.name)
  })
</script>

<style scoped lang="scss">
  .spn-item__form {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    padding: 1rem 0;
  }

  .spn-item__field {
    flex: 1;
    margin-bottom: 0;
  }

  .spn-item__actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
</style>
