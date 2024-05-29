<template>
  <PartnerOrganizationForm
    :is-submitting="isSubmitting"
    :caught-errors="caughtErrors"
    :partner-id="partner.id"
    :show-phone2="!!partner.phone2"
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
    EditPartnerOrganizationInput,
    editDataInclusionPartnerOrganizationSchema,
    editCustomPartnerOrganizationSchema
  } from '~/server/schema'

  const props = defineProps<{
    isSubmitting: boolean
    id: string
    finish: (partner: EditPartnerOrganizationInput) => void
    cancel: () => void
    restore: (partner: PartnerOrganizationData) => void
  }>()

  const partner = await useTrpcClient().partner.getOne.query({ id: props.id })

  const hasDataInclusionStructure = ref(partner.dataInclusionStructure !== null)

  const schema = computed(() =>
    hasDataInclusionStructure.value
      ? toTypedSchema(editDataInclusionPartnerOrganizationSchema)
      : toTypedSchema(editCustomPartnerOrganizationSchema)
  )

  function setInitialValues() {
    const structure = partner.dataInclusionStructure
    const el = structure || partner

    return {
      id: partner.id,
      ...(structure !== null && {
        dataInclusionId: partner.dataInclusionId || undefined
      }),
      siret: el.siret,
      name: el.name,
      email: el.email,
      phone1: structure ? structure.phone : partner.phone1,
      phone2: partner.phone2,
      address: el.address,
      city: el.city,
      zipcode: el.zipcode,
      workingHours: el.workingHours,
      contacts: (partner.contacts || []).map(({ id, name, email, phone }) => ({
        id,
        name,
        email,
        phone,
        deleted: false
      }))
    }
  }

  const { handleSubmit, setValues } = useForm<EditPartnerOrganizationInput>({
    validationSchema: schema,
    initialValues: setInitialValues()
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
        setValues({
          siret: null,
          email: null,
          phone1: null,
          phone2: null,
          address: null,
          city: null,
          zipcode: null,
          workingHours: null
        })
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
