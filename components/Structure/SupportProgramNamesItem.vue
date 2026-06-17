<template>
  <li class="spn-item">
    <form
      class="spn-item__form"
      novalidate
      @submit.prevent="onSubmit"
    >
      <VeeInput
        name="name"
        :label="supportProgramFieldLabels.name"
        :disabled="isSubmitting"
        :success-message="successMessage"
        hint="Ajouter ou modifier un nom de dispositif puis valider"
        class="spn-item__field"
        @change-input="onInput($event)"
      />

      <div
        v-if="canEdit"
        class="spn-item__actions"
      >
        <button
          class="fr-btn fr-btn--secondary"
          type="submit"
          :disabled="
            isSubmitting || !currentName.trim() || currentName === props.name
          "
        >
          Valider
        </button>

        <button
          class="fr-btn fr-btn--secondary fr-icon-delete-line btn-delete-action"
          data-fr-opened="false"
          aria-controls="global-modal"
          type="button"
          :disabled="!id"
          @click="emit('remove')"
        >
          Supprimer
        </button>
      </div>
    </form>
  </li>
</template>

<script setup lang="ts">
  import { supportProgramFieldLabels } from '~/client/labels'
  import { upsertSupportProgramNameSchema } from '~/server/schema'

  const props = defineProps<{
    id?: string
    name: string
    canEdit: boolean
    isSubmitting: boolean
    successMessage?: string
  }>()

  const emit = defineEmits<{
    update: [name: string]
    remove: []
    clearSuccess: []
  }>()

  const { handleSubmit, setValues } = useForm({
    validationSchema: toTypedSchema(upsertSupportProgramNameSchema),
    initialValues: props.id
      ? { id: props.id, name: props.name }
      : { name: props.name }
  })

  const currentName = ref(props.name)

  watch(
    () => props.name,
    value => {
      setValues({ name: value })
      currentName.value = value
    }
  )

  function onInput(value: string) {
    currentName.value = value
    if (props.successMessage) {
      emit('clearSuccess')
    }
  }

  const onSubmit = handleSubmit(values => {
    emit('update', values.name)
  })
</script>

<style scoped lang="scss">
  .spn-item__form {
    display: flex;
    align-items: flex-start;
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
    margin-top: 3.5rem;
  }
</style>
