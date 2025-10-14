<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors
  />
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <VeeRadioButtons
          name="gender"
          :label="workshopExternalAttendeeLabels.gender"
          :options="beneficiaryGenderKeys.options"
          :disabled="values.type === 'Beneficiary'"
        />
      </div>

      <VeeInput
        class="fr-col-12 fr-col-lg-6"
        name="lastName"
        :label="workshopExternalAttendeeLabels.lastName"
        :disabled="values.type === 'Beneficiary'"
      />
      <VeeInput
        class="fr-col-12 fr-col-lg-6"
        name="firstName"
        :label="workshopExternalAttendeeLabels.firstName"
        :disabled="values.type === 'Beneficiary'"
      />
      <VeeInput
        class="fr-col-12 fr-col-lg-6"
        name="phone"
        :label="workshopExternalAttendeeLabels.phone"
        :disabled="values.type === 'Beneficiary'"
        type="tel"
      />
      <VeeInput
        class="fr-col-12 fr-col-lg-6"
        name="email"
        :label="workshopExternalAttendeeLabels.email"
        :disabled="values.type === 'Beneficiary'"
        type="email"
      />

      <VeeInput
        class="fr-col-12"
        name="birthDate"
        :label="workshopExternalAttendeeLabels.birthDate"
        :disabled="values.type === 'Beneficiary'"
        type="date"
      />

      <VeeCityInput
        class="fr-col-12"
        name="city"
        :label="workshopExternalAttendeeLabels.city"
        :disabled="values.type === 'Beneficiary'"
      />

      <VeeInput
        class="fr-col-12"
        name="comment"
        label="Commentaire"
      />

      <template v-if="isWorkshopChargeable">
        <div class="fr-col-12">
          <VeeRadioButtons
            name="paymentReceived"
            :label="workshopAttendeeLabels.paymentReceived"
            :options="paymentReceivedKeys.options"
          />
        </div>
        <VeeCurrencyInput
          v-if="values.paymentReceived === 'true'"
          class="fr-col-12 fr-col-md-8 fr-col-lg-6"
          name="paymentAmount"
          :label="workshopAttendeeLabels.paymentAmount"
        />
      </template>
    </div>

    <DsfrButtonGroup
      class="fr-mt-4w"
      equisized
      inline-layout-when="always"
      align="right"
    >
      <li>
        <DsfrButton
          label="Annuler"
          type="button"
          secondary
          @click="modal.close()"
        ></DsfrButton>
      </li>

      <li>
        <DsfrButton
          label="Valider"
          type="submit"
          :data-submitting="status === 'pending'"
          :disabled="status === 'pending'"
          :readonly="status === 'pending'"
        ></DsfrButton>
      </li>
    </DsfrButtonGroup>
  </form>
</template>

<script setup lang="ts">
  import {
    workshopExternalAttendeeLabels,
    workshopAttendeeLabels
  } from '~/client/labels'
  import { beneficiaryGenderKeys, paymentReceivedKeys } from '~/client/options'
  import type { UpdateAttendeeInput } from '~/server/schema'
  import { updateAttendeeSchema } from '~/server/schema'
  import type { WorkshopAttendee } from '~/types/workshop'

  const modal = useModal()
  const snackbar = useSnackbar()

  const { attendee, refresh, isWorkshopChargeable } = defineProps<{
    isWorkshopChargeable: boolean | null
    attendee: WorkshopAttendee
    refresh: () => void
  }>()

  /** Manage form and errors */
  const { handleSubmit, values, setFieldValue } = useForm<UpdateAttendeeInput>({
    validationSchema: toTypedSchema(updateAttendeeSchema),
    initialValues: {
      ...attendee,
      attendeeId: attendee.id,
      paymentAmount: Number(attendee.paymentAmount)
    }
  })
  // initialValues doesn't work for paymentReceived
  setFieldValue(
    'paymentReceived',
    typeof attendee.paymentReceived === 'boolean'
      ? (attendee.paymentReceived.toString() as 'true' | 'false')
      : undefined
  )

  const form = ref<HTMLFormElement | null>(null)

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      onUpdateAttendee(values)
    }
  )

  const { mutate, status, error } =
    useTrpcClient().workshop.updateAttendee.useMutation()

  async function onUpdateAttendee(values: UpdateAttendeeInput) {
    const res = await mutate(values)
    if (error.value || !res) {
      snackbar.error(
        'La modification du participant à échoué.',
        snackbar.focus()
      )
      return
    }
    snackbar.success('Participant mis-à-jour avec succès.')
    refresh()
    modal.close()
  }

  const { errors } = useDisplayFormErrors(
    form,
    caughtErrors,
    workshopExternalAttendeeLabels
  )
</script>

<style lang="scss" scoped>
  :deep(.fr-input-group) {
    margin-bottom: 0;
  }

  :deep(.fr-fieldset) {
    margin-bottom: 0;
  }

  :deep(.fr-fieldset__element) {
    margin-bottom: 0;
  }
</style>
