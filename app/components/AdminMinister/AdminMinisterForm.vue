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
          :label="ministerFieldLabels.government"
          name="government"
          required
          hint="Exemple: Barnier ou Lecornu"
        />
      </div>

      <div class="fr-col-12 fr-col-lg-6">
        <VeeSelect
          :label="ministerFieldLabels.status"
          name="status"
          required
          :options="withEmptyValue(statusOptions)"
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
  } from '~~/server/schema'
  import type { AdminMinisterOutput } from './types'
  import { ministerFieldLabels } from '~~/client/labels/minister.label'
  import { ministerStatusKeys } from '~~/client/options'
  import { MinisterStatus } from '@prisma/client'

  const props = defineProps<{
    minister: AdminMinisterOutput | null
    isSubmitting: boolean
    create: boolean
  }>()

  const emit = defineEmits<{
    UpdateMinister: [minister: UpdateMinisterInput | CreateMinisterInput]
    CreateMinister: [minister: CreateMinisterInput | UpdateMinisterInput]
  }>()

  const form = useTemplateRef('form')

  const { handleSubmit } = useForm<UpdateMinisterInput | CreateMinisterInput>({
    validationSchema: toTypedSchema(
      props.minister ? updateMinisterSchema : createMinisterSchema
    ),
    initialValues: {
      id: props.minister?.id,
      firstName: props.minister?.firstName,
      lastName: props.minister?.lastName,
      function: props.minister?.function,
      government: props.minister?.government,
      status: props.minister?.status
    }
  })

  const { onSubmit: onUpdateMinister, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    minister => {
      return props.create
        ? emit('CreateMinister', minister)
        : emit('UpdateMinister', minister)
    }
  )

  const statusOptions = computed(() =>
    ministerStatusKeys.options.filter(o => o.value !== MinisterStatus.Deleted)
  )

  const { errors } = useDisplayFormErrors(
    form,
    caughtErrors,
    ministerFieldLabels
  )
</script>
