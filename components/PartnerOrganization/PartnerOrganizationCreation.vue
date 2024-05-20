<template>
  <PartnerOrganizationForm
    :is-submitting="isSubmitting"
    :caught-errors="caughtErrors"
    :show-phone2="false"
    :has-data-inclusion-structure="hasDataInclusionStructure"
    @submit="onSubmit"
    @cancel="onCancel"
    @restore="onRestore"
    @select-structure="onSelectDataInclusionStructure"
  />
</template>

<script lang="ts" setup>
  import { toTypedSchema } from '@vee-validate/zod'
  import { PartnerOrganizationData, DataInclusionStructure } from './types'
  import {
    AddPartnerOrganizationInput,
    addCustomPartnerOrganizationSchema,
    addDataInclusionPartnerOrganizationSchema
  } from '~/server/schema'

  const props = defineProps<{
    isSubmitting: boolean
    finish: (partner: AddPartnerOrganizationInput) => void
    cancel: () => void
    restore: (partner: PartnerOrganizationData) => void
  }>()

  const hasDataInclusionStructure = ref(false)

  const schema = computed(() =>
    hasDataInclusionStructure.value
      ? toTypedSchema(addDataInclusionPartnerOrganizationSchema)
      : toTypedSchema(addCustomPartnerOrganizationSchema)
  )

  const { handleSubmit, setValues, resetForm } =
    useForm<AddPartnerOrganizationInput>({
      validationSchema: schema,
      initialValues: {}
    })

  const { caughtErrors, onSubmit } = useCatchFormErrors(
    handleSubmit,
    values => {
      props.finish(values)
    }
  )

  function onCancel() {
    props.cancel()
  }

  function onRestore(partner: PartnerOrganizationData) {
    props.restore(partner)
  }

  function onSelectDataInclusionStructure(
    structure: DataInclusionStructure | null
  ) {
    if (!structure) {
      if (hasDataInclusionStructure.value) {
        resetForm()
      }
      hasDataInclusionStructure.value = false

      return
    }

    hasDataInclusionStructure.value = true
    setValues({
      dataInclusionId: structure.id,
      name: structure.name,
      siret: structure.siret || null,
      address: structure.address,
      zipcode: structure.zipcode,
      city: structure.city,
      email: structure.email,
      phone1: structure.phone,
      workingHours: structure.workingHours
    })
  }
</script>
