<template>
  <form
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <VeeInput
          name="name"
          label="Nom du dispositif (obligatoire)"
          hint="Choisissez un nom court et clair"
        />
      </div>

      <div class="fr-col-12">
        <ul
          class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right fr-mt-3w"
        >
          <li>
            <button
              class="fr-btn fr-btn--secondary"
              type="button"
              @click="modal.close"
            >
              Annuler
            </button>
          </li>
          <li>
            <button
              class="fr-btn"
              type="submit"
              :disabled="isSubmitting"
              :data-submitting="isSubmitting"
            >
              {{ submitLabel }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
  import type { UpsertSupportProgramNameInput } from '~/server/schema'
  import { upsertSupportProgramNameSchema } from '~/server/schema'

  const modal = useModal()

  const props = defineProps<{
    id?: string
    name?: string
    isSubmitting: boolean
    validate: (name: string, id?: string) => boolean
    submit: (values: UpsertSupportProgramNameInput) => void
  }>()

  const submitLabel = computed(() => (props.id ? 'Modifier' : 'Ajouter'))

  const { handleSubmit, setErrors } = useForm<UpsertSupportProgramNameInput>({
    validationSchema: toTypedSchema(upsertSupportProgramNameSchema),
    initialValues: {
      id: props.id,
      name: props.name ?? ''
    }
  })

  const onSubmit = handleSubmit(values => {
    const isUnique = props.validate(values.name, props.id)
    if (!isUnique) {
      setErrors({
        name: 'Ce nom de dispositif existe déjà'
      })
      return
    }
    props.submit(values)
  })
</script>
