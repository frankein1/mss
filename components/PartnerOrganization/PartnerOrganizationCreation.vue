<template>
  <PartnerOrganizationForm
    :is-submitting="isSubmitting"
    :caught-errors="caughtErrors"
    :show-phone2="false"
    :data-source="currentDataSource"
    :existing-data-inclusion-v1-ids="existingDataInclusionV1Ids"
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
    addDataInclusionV1PartnerOrganizationSchema,
    limitPOAddress,
    limitPOName,
    limitPOWebsite,
    limitPOWorkingHours
  } from '~/server/schema'

  const props = defineProps<{
    isSubmitting: boolean
    existingDataInclusionV1Ids: string[]
    finish: (partner: AddPartnerOrganizationInput) => void
    cancel: () => void
    restore: (partner: PartnerOrganizationData) => void
  }>()

  const currentDataSource = ref<'Custom' | 'DataInclusionV1'>('Custom')

  const schema = computed(() =>
    currentDataSource.value === 'DataInclusionV1'
      ? toTypedSchema(addDataInclusionV1PartnerOrganizationSchema)
      : toTypedSchema(addCustomPartnerOrganizationSchema)
  )

  const { handleSubmit, setValues, resetForm } =
    useForm<AddPartnerOrganizationInput>({
      validationSchema: schema,
      initialValues: { dataSource: currentDataSource.value }
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
      if (currentDataSource.value === 'DataInclusionV1') {
        resetForm()
      }
      currentDataSource.value = 'Custom'
      return
    }

    currentDataSource.value = 'DataInclusionV1'
    // Some fields from data inclusion can evolve to be very long. Tey are truncated
    // to the limit specified in the schema
    setValues({
      dataSource: 'DataInclusionV1',
      dataInclusionIdV1: structure.id,
      name: structure.name.substring(0, limitPOName),
      siret: structure.siret || null,
      address: structure.address?.substring(0, limitPOAddress),
      zipcode: structure.zipcode,
      city: structure.city,
      email: structure.email,
      phone1: structure.phone,
      website: structure.website?.substring(0, limitPOWebsite),
      workingHours: structure.workingHours?.substring(0, limitPOWorkingHours)
    })
  }
</script>
