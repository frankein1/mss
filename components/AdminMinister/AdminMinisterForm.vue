<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <form
    ref="form"
    novalidate
    class="fr-container--fluid"
    @submit.prevent="onUpdateMinister"
  >
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <div class="fr-col-12 fr-col-lg-6">
        <VeeInput
          :label="ministerFieldLabels.firstName"
          name="firstName"
          required
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <VeeInput
          :label="ministerFieldLabels.lastName"
          name="lastName"
          required
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <VeeInput
          :label="ministerFieldLabels.function"
          name="function"
          required
        />
      </div>

      <div class="fr-col-12 fr-col-lg-6">
        <VeeInput
          :label="ministerFieldLabels.ministry"
          name="ministry"
        />
      </div>

      <div class="fr-col-12 fr-col-lg-6">
        <VeeInput
          :label="ministerFieldLabels.government"
          name="government"
        />
      </div>

      <div class="fr-col-12 fr-col-lg-6">
        <VeeCheckbox
          :label="ministerFieldLabels.former"
          name="former"
        />
      </div>
    </div>

    <button
      class="fr-btn fr-btn--lg submit-btn fr-mt-2w"
      type="submit"
      :disabled="isSubmitting"
      :data-submitting="isSubmitting"
    >
      Enregistrer
    </button>
  </form>
</template>

<script lang="ts" setup>
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    type UpdateMinisterInput,
    type CreateMinisterInput,
    updateMinisterSchema,
    createMinisterSchema
  } from '~/server/schema'
  import type { AdminMinisterOutput } from './types'
  import { ministerFieldLabels } from '~/client/labels/minister.label'

  const props = defineProps<{
    minister: AdminMinisterOutput
    isSubmitting: boolean
  }>()

  const emit = defineEmits<{
    UpdateMinister: [minister: UpdateMinisterInput | CreateMinisterInput]
  }>()

  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit } = useForm<UpdateMinisterInput | CreateMinisterInput>({
    validationSchema: toTypedSchema(
      props.minister ? updateMinisterSchema : createMinisterSchema
    ),
    initialValues: {
      id: props.minister?.id,
      firstName: props.minister?.firstName,
      lastName: props.minister?.lastName,
      function: props.minister?.function,
      ministry: props.minister?.ministry,
      government: props.minister?.government,
      former: props.minister?.former
    }
  })

  const { onSubmit: onUpdateMinister, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    minister => {
      emit('UpdateMinister', minister)
    }
  )

  const { errors } = useDisplayFormErrors(
    form,
    caughtErrors,
    ministerFieldLabels
  )
</script>
