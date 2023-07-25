<template>
  <form
    class="fr-container--fluid"
    @submit="onUpdateStructure"
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
      :custom-followup-types="customFollowupTypes"
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
    CustomFollowupTypeWithSupportsCount,
    DefaultLegallyNotRequiredFollowupTypeWithSupportsCount,
    DefaultLegallyRequiredFollowupTypeWithSupportsCount,
    StructureWithFollowupTypesWithSupportsCount
  } from './types'
  import { AdminStructureOutput } from '~/server/routers'
  import type {
    AdminEditStructureInput,
    EditCurrentUserStructureInput
  } from '~/server/schema'
  import {
    editCurrentUserStructureSchema,
    adminEditStructureSchema
  } from '~/server/schema'
  import { FollowupTypeWithSupportsCount } from '~/types/followupType'

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
    (
      e: 'updateStructure',
      structure: EditCurrentUserStructureInput & AdminEditStructureInput
    ): void
  }>()

  const defaultLegallyRequiredSelectedFollowupTypes = computed(() =>
    props.structure.followupTypes.filter(isDefaultLegallyRequired)
  )

  const defaultLegallyNotRequiredSelectedFollowupTypes = computed(() =>
    props.structure.followupTypes.filter(isDefaultLegallyNotRequired)
  )

  const customFollowupTypes = computed(() =>
    props.structure.followupTypes.filter(isCustom)
  )

  const initialLegallyRequiredSelectedIds = computed(() =>
    defaultLegallyRequiredSelectedFollowupTypes.value.map(
      ({ default: defaultKey }) => defaultKey
    )
  )

  const initialLegallyNotRequiredSelectedIds = computed(() => [
    ...defaultLegallyNotRequiredSelectedFollowupTypes.value.map(
      ({ default: defaultKey }) => defaultKey
    ),
    ...customFollowupTypes.value.map(({ id }) => id)
  ])

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

  const onUpdateStructure = handleSubmit(structure => {
    emit('updateStructure', structure)
  })

  function isDefaultLegallyRequired(
    f: FollowupTypeWithSupportsCount
  ): f is DefaultLegallyRequiredFollowupTypeWithSupportsCount {
    return !!(f.default && f.legallyRequired)
  }

  function isDefaultLegallyNotRequired(
    f: FollowupTypeWithSupportsCount
  ): f is DefaultLegallyNotRequiredFollowupTypeWithSupportsCount {
    return !!(f.default && !f.legallyRequired)
  }

  function isCustom(
    f: FollowupTypeWithSupportsCount
  ): f is CustomFollowupTypeWithSupportsCount {
    return f.default === null
  }
</script>
