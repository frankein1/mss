<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <section class="fr-mb-2w">
      <VeeRadioButtons
        :label="''"
        name="beneficiaryId"
        :options="beneficiaryOptions"
        :inline="false"
        required
      />
    </section>

    <DsfrButtonGroup
      equisized
      inline-layout-when="always"
      align="right"
    >
      <li>
        <DsfrButton
          label="Annuler"
          type="button"
          secondary
          @click="cancel"
        ></DsfrButton>
      </li>

      <li>
        <DsfrButton
          label="Prendre rendez-vous"
          type="submit"
          :disabled="isSubmittingAppointmentPlan"
          :data-submitting="isSubmittingAppointmentPlan"
        ></DsfrButton>
      </li>
    </DsfrButtonGroup>
  </form>
</template>

<script setup lang="ts">
  import { z } from 'zod'

  const props = defineProps<{
    id: string
    beneficiaryOptions: { label: string; value: string }[]
    planAppointment: (
      beneficiaryId: string,
      fromModal: boolean
    ) => Promise<void>
    isSubmittingAppointmentPlan: boolean
  }>()

  const modal = useModal()

  const form = useTemplateRef('form')

  const { handleSubmit } = useForm<{ beneficiaryId: string }>({
    validationSchema: toTypedSchema(z.object({ beneficiaryId: z.string() })),
    initialValues: { beneficiaryId: props.id }
  })

  const onSubmit = handleSubmit(async values => {
    await props.planAppointment(values.beneficiaryId, true)
    modal.close()
  })

  function cancel() {
    modal.close()
    setFocusAfterClose('#action-rdv', 'button')
  }
</script>
