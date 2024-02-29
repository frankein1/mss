<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <form
    ref="form"
    novalidate
    class="fr-container--fluid"
    @submit.prevent="onUpdateStructure"
  >
    <StructureFormAdmin v-if="adminView" />

    <StructureFormInformation
      :structure="structure"
      :set-field-value="setFieldValue"
    />

    <StructureFormSocialSupportSubjects
      :structure-id="structure.id"
      :required-subjects="requiredSubjects"
      :optional-subjects="optionalSubjects"
      :admin-view="adminView"
    />

    <StructureFormAdminUsers
      v-if="adminView && users"
      :structure-id="structure.id"
      :users="users"
    />

    <button
      class="fr-btn fr-btn--lg submit-btn"
      type="submit"
      :disabled="isSubmitting"
      :submitting="isSubmitting"
    >
      Modifier {{ adminView ? 'la' : 'ma' }} structure
    </button>
  </form>
</template>

<script lang="ts" setup>
  import {
    SocialSupportSubject,
    DefaultSocialSupportSubject
  } from '@prisma/client'
  import { StructureFormType, UsersStructureType } from './types'
  import type {
    AdminEditStructureInput,
    EditCurrentUserStructureInput
  } from '~/server/schema'
  import {
    editCurrentUserStructureSchema,
    adminEditStructureSchema
  } from '~/server/schema'
  import { structureFieldLabels } from '~/client/labels'

  const props = withDefaults(
    defineProps<{
      structure: StructureFormType
      optionalSubjects: SocialSupportSubject[]
      requiredSubjects: SocialSupportSubject[]
      users?: UsersStructureType
      isSubmitting: boolean
      adminView?: boolean
    }>(),
    {
      adminView: false,
      users: undefined
    }
  )

  const emit = defineEmits<{
    updateStructure: [
      structure: EditCurrentUserStructureInput & AdminEditStructureInput
    ]
  }>()

  const requiredSubjectIds = computed(() =>
    props.requiredSubjects.map(
      ({ id, default: defaultKey }) => defaultKey || id
    )
  )

  const optionalSubjectIds = computed(() =>
    props.optionalSubjects.map(
      ({ id, default: defaultKey }) => defaultKey || id
    )
  )

  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit, setFieldValue } = useForm<
    EditCurrentUserStructureInput & AdminEditStructureInput
  >({
    validationSchema: toTypedSchema(
      props.adminView
        ? adminEditStructureSchema
        : editCurrentUserStructureSchema
    ),
    initialValues: {
      structureId: props.structure.id,
      type: props.structure.type,
      inhabitantsNumber: props.structure.inhabitantsNumber,
      inseeCode: props.structure.inseeCode,
      siret: props.structure.siret,
      name: props.structure.name,
      zipcode: props.structure.zipcode,
      city: props.structure.city,
      address: props.structure.address,
      phone: props.structure.phone,
      email: props.structure.email,
      legallyRequiredSocialSupportSubjects:
        requiredSubjectIds.value as DefaultSocialSupportSubject[],
      legallyNotRequiredSocialSupportSubjects:
        optionalSubjectIds.value as DefaultSocialSupportSubject[]
    }
  })

  const { onSubmit: onUpdateStructure, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    structure => {
      emit('updateStructure', structure)
    }
  )

  const { errors } = useDisplayFormErrors(
    form,
    caughtErrors,
    structureFieldLabels
  )
</script>
