<template>
  <AtomCallout title="La personne ne sera pas enregistrée comme bénéficiaire">
    <p>
      Les informations saisies seront disponibles uniquement dans cet atelier et
      seront anonymisées 3 mois après la fin de l’atelier.
    </p>
  </AtomCallout>

  <FormErrors
    v-if="errors.length > 1"
    :errors
  />
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <h2 class="fr-text--sm fr-text--bold text--uppercase">
      Informations facultatives
    </h2>

    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <VeeRadioButtons
          name="gender"
          :label="workshopExternalAttendeeLabels.gender"
          :options="beneficiaryGenderKeys.options"
        />
      </div>

      <VeeInput
        class="fr-col-12 fr-col-lg-6"
        name="lastName"
        :label="workshopExternalAttendeeLabels.lastName"
      />
      <VeeInput
        class="fr-col-12 fr-col-lg-6"
        name="firstName"
        :label="workshopExternalAttendeeLabels.firstName"
      />
      <VeeInput
        class="fr-col-12 fr-col-lg-6"
        name="phone"
        :label="workshopExternalAttendeeLabels.phone"
        type="tel"
      />
      <VeeInput
        class="fr-col-12 fr-col-lg-6"
        name="email"
        :label="workshopExternalAttendeeLabels.email"
        type="email"
      />

      <VeeInput
        class="fr-col-12"
        name="birthDate"
        :label="workshopExternalAttendeeLabels.birthDate"
        type="date"
      />
      <BeneficiaryFormSimilarAlert
        v-model:similar-beneficiary="similarBeneficiary"
        :usual-name="values.lastName"
        :first-name="values.firstName"
        :birth-date="values.birthDate || null"
      />

      <div class="fr-col-12">
        <VeeCityCombobox
          name="city"
          :label="workshopExternalAttendeeLabels.city"
          :request-limit="30"
        />
      </div>

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
  import type { SimilarBeneficiary } from '~/server/route'
  import type { CreateExternalAttendeeInput } from '~/server/schema'
  import { createExternalAttendeeSchema } from '~/server/schema'

  const { workshopId, refresh } = defineProps<{
    workshopId: string
    isWorkshopChargeable: boolean | null
    refresh: () => void
  }>()

  const modal = useModal()
  const snackbar = useSnackbar()

  /** Manage form and errors */
  const { handleSubmit, values } = useForm<CreateExternalAttendeeInput>({
    validationSchema: toTypedSchema(createExternalAttendeeSchema),
    initialValues: {
      workshopId
    }
  })

  const form = useTemplateRef('form')

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      onCreateExternalAttendee(values)
    }
  )

  const { mutate, status, error } =
    useTrpcClient().workshop.createExternalAttendee.useMutation()

  async function onCreateExternalAttendee(values: CreateExternalAttendeeInput) {
    const res = await mutate(values)
    if (error.value || !res) {
      snackbar.error(
        "L'ajout d'un participant extérieur à échoué.",
        snackbar.focus()
      )
      return
    }
    snackbar.success('Participant ajouté')
    refresh()
    modal.close()
  }

  const { errors } = useDisplayFormErrors(
    form,
    caughtErrors,
    workshopExternalAttendeeLabels
  )

  /** Manage duplicate attendees */
  const similarBeneficiary = ref<SimilarBeneficiary>(undefined)
</script>

<style scoped>
  .fr-input-group,
  .fr-fieldset {
    margin-bottom: 0;
  }

  .fr-fieldset__element {
    margin-bottom: 0;
  }
</style>
