<template>
  <PartnerOrganizationForm
    :is-submitting="isSubmitting"
    :caught-errors="caughtErrors"
    :show-phone2="false"
    :has-data-inclusion-structure="hasDataInclusionStructure"
    :existing-data-inclusion-ids="existingDataInclusionIds"
    @submit="onSubmit"
    @cancel="onCancel"
    @restore="onRestore"
    @select-structure="onSelectDataInclusionStructure"
  />
</template>

<script lang="ts" setup>
  import { toTypedSchema } from '@vee-validate/zod'
  import type { PartnerOrganizationData, DataInclusionStructure } from './types'
  import type { AddPartnerOrganizationInput } from '~/server/schema'
  import {
    addCustomPartnerOrganizationSchema,
    addDataInclusionPartnerOrganizationSchema,
    limitPOAddress,
    limitPOName,
    limitPOWorkingHours
  } from '~/server/schema'

  const props = defineProps<{
    isSubmitting: boolean
    existingDataInclusionIds: string[]
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
    // Some fields from data inclusion can evolve to be very long. Tey are truncated
    // to the limit specified in the schema
    setValues({
      dataInclusionId: structure.id,
      name: structure.name.substring(0, limitPOName),
      siret: structure.siret || null,
      address: structure.address?.substring(0, limitPOAddress),
      zipcode: structure.zipcode,
      city: structure.city,
      email: structure.email,
      phone1: structure.phone,
      workingHours: structure.workingHours?.substring(0, limitPOWorkingHours)
    })
  }
</script>
