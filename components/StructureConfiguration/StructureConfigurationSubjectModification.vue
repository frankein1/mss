<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <VeeInput
          name="name"
          label="Intitulé de l’objet d’accompagnement"
          hint="Choisissez un nom court et clair"
          required
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
              :submitting="isSubmitting"
              :disabled="isSubmitting"
            >
              Modifier
            </button>
          </li>
        </ul>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
  import {
    updateSocialSupportSubjectSchema,
    UpdateSocialSupportSubjectNameInput
  } from '~/server/schema'

  const modal = useModal()

  const props = defineProps<{
    id: string
    name: string
    isSubmitting: boolean
  }>()

  const emit = defineEmits<{
    update: [values: UpdateSocialSupportSubjectNameInput]
  }>()

  const { handleSubmit } = useForm<UpdateSocialSupportSubjectNameInput>({
    validationSchema: toTypedSchema(updateSocialSupportSubjectSchema),
    initialValues: {
      id: props.id,
      name: props.name
    }
  })

  const { onSubmit } = useCatchFormErrors(handleSubmit, values =>
    emit('update', values)
  )
</script>
