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

    <StructureFormFollowupTypes
      :structure-id="structure.id"
      :required-types="requiredTypes"
      :optional-types="optionalTypes"
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
  import { FollowupType } from '@prisma/client'
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
  import { DefaultFollowupType } from '~/server/prisma/prismaClient'

  const props = withDefaults(
    defineProps<{
      structure: StructureFormType
      optionalTypes: FollowupType[]
      requiredTypes: FollowupType[]
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

  const requiredTypeIds = computed(() =>
    props.requiredTypes.map(({ id, default: defaultKey }) => defaultKey || id)
  )

  const optionalTypeIds = computed(() =>
    props.optionalTypes.map(({ id, default: defaultKey }) => defaultKey || id)
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
      legallyRequiredFollowupTypes:
        requiredTypeIds.value as DefaultFollowupType[],
      legallyNotRequiredFollowupTypes:
        optionalTypeIds.value as DefaultFollowupType[]
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
