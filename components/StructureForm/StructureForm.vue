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
      :structure-followup-types="structure.followupTypes"
      :default-legally-required-selected-followup-types="
        defaultLegallyRequiredSelectedFollowupTypes
      "
      :default-legally-not-required-selected-followup-types="
        defaultLegallyNotRequiredSelectedFollowupTypes
      "
      :admin-view="adminView"
    />

    <StructureFormAdminUsers
      v-if="adminView"
      :structure="structure as AdminStructureOutput"
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
  import type {
    DefaultLegallyNotRequiredFollowupTypeWithSupportsCount,
    DefaultLegallyRequiredFollowupTypeWithSupportsCount,
    StructureWithFollowupTypesWithSupportsCount
  } from './types'
  import { AdminStructureOutput } from '~/server/trpc/routers'
  import type {
    AdminEditStructureInput,
    EditCurrentUserStructureInput
  } from '~/server/schema'
  import {
    editCurrentUserStructureSchema,
    adminEditStructureSchema
  } from '~/server/schema'
  import { FollowupTypeWithSupportsCount } from '~/types/followupType'
  import { structureFieldLabels } from '~/client/labels'

  const props = withDefaults(
    defineProps<{
      structure:
        | StructureWithFollowupTypesWithSupportsCount
        | AdminStructureOutput
      isSubmitting: boolean
      adminView?: boolean
    }>(),
    {
      adminView: false
    }
  )

  const emit = defineEmits<{
    updateStructure: [
      structure: EditCurrentUserStructureInput & AdminEditStructureInput
    ]
  }>()

  const form = ref<HTMLFormElement | null>(null)

  const defaultLegallyRequiredSelectedFollowupTypes = computed(() =>
    props.structure.followupTypes.filter(isDefaultLegallyRequired)
  )

  const defaultLegallyNotRequiredSelectedFollowupTypes = computed(() =>
    props.structure.followupTypes.filter(isDefaultLegallyNotRequired)
  )

  const initialLegallyRequiredSelectedIds = computed(() =>
    defaultLegallyRequiredSelectedFollowupTypes.value.map(
      ({ default: defaultKey }) => defaultKey
    )
  )

  const initialLegallyNotRequiredSelectedIds = computed(() =>
    defaultLegallyNotRequiredSelectedFollowupTypes.value.map(
      ({ default: defaultKey }) => defaultKey
    )
  )

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
      legallyRequiredFollowupTypes: initialLegallyRequiredSelectedIds.value,
      legallyNotRequiredFollowupTypes:
        initialLegallyNotRequiredSelectedIds.value
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

  function isDefaultLegallyRequired(
    f: FollowupTypeWithSupportsCount
  ): f is DefaultLegallyRequiredFollowupTypeWithSupportsCount {
    return !!f.legallyRequired
  }

  function isDefaultLegallyNotRequired(
    f: FollowupTypeWithSupportsCount
  ): f is DefaultLegallyNotRequiredFollowupTypeWithSupportsCount {
    return !f.legallyRequired
  }
</script>
