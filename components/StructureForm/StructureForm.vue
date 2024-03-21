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
    <StructureFormAdmin />

    <StructureFormInformation
      :structure="structure"
      :set-field-value="setFieldValue"
    />

    <StructureFormAdminUsers
      v-if="users"
      :structure-id="structure.id"
      :users="users"
    />

    <button
      class="fr-btn fr-btn--lg submit-btn"
      type="submit"
      :disabled="isSubmitting"
      :submitting="isSubmitting"
    >
      Modifier la structure
    </button>
  </form>
</template>

<script lang="ts" setup>
  import { StructureFormType, UsersStructureType } from './types'
  import type { AdminEditStructureInput } from '~/server/schema'
  import { adminEditStructureSchema } from '~/server/schema'
  import { structureFieldLabels } from '~/client/labels'

  const props = withDefaults(
    defineProps<{
      structure: StructureFormType
      users?: UsersStructureType
      isSubmitting: boolean
    }>(),
    {
      users: undefined
    }
  )

  const emit = defineEmits<{
    updateStructure: [structure: AdminEditStructureInput]
  }>()

  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit, setFieldValue } = useForm<AdminEditStructureInput>({
    validationSchema: toTypedSchema(adminEditStructureSchema),
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
      email: props.structure.email
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
