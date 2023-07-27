<template>
  <form
    ref="form"
    @submit="onSubmit"
  >
    <VeeMultiSelect
      name="referents"
      label="Agent(s) référent(s)"
      :options="referentOptions"
      required
      dropdown
      readonly
    />

    <VeeCheckbox
      class="fr-mb-4w"
      label="Mandat Aidant Connect"
      name="aidantConnectAuthorized"
    />

    <div
      ref="accordion"
      class="fr-accordions-group"
    >
      <AccordionFieldset label="Informations générales">
        <BeneficiaryFormGeneralInformation
          :status="values.general.status"
          :no-phone="values.general.noPhone"
          :zipcode="values.general.zipcode"
          :city="values.general.city"
          :region="values.general.region"
        />
      </AccordionFieldset>
    </div>

    <VeeTextarea
      class="fr-col-12"
      name="additionalInformation"
      label="Informations complémentaires"
      hint
    >
      <template #hint>
        {{
          "Il est fortement recommandé de ne stocker que les informations utiles au suivi du bénéficiaire et d'éviter le recueil d'informations sensibles (données de santé, mots de passe, etc)."
        }}
      </template>
    </VeeTextarea>

    <button
      class="fr-btn fr-btn--lg submit-btn"
      type="submit"
      :submitting="isSubmitting"
      :disabled="isSubmitting"
      @click="onCheckValidationBeforeSubmit"
    >
      Enregistrer
    </button>
  </form>
</template>

<script setup lang="ts">
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { BeneficiaryReferent } from '~/types/beneficiary'
  import {
    UpdateBeneficiaryInput,
    updateBeneficiarySchema
  } from '~/server/schema/beneficiary.schema'
  import type { GetBeneficiaryOutput } from '~/server/routers'
  import { toOptions } from '~/utils/options'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
    isSubmitting: boolean
    agents: BeneficiaryReferent[]
  }>()

  const emit = defineEmits<{
    saveBeneficiary: [beneficiary: UpdateBeneficiaryInput]
  }>()

  const { handleSubmit, values } = useForm<UpdateBeneficiaryInput>({
    validationSchema: toTypedSchema(updateBeneficiarySchema),
    initialValues: {
      id: props.beneficiary.id,
      structureId: props.beneficiary.structureId,
      referents: props.beneficiary.referents.map(referent => referent.id),
      aidantConnectAuthorized: props.beneficiary.aidantConnectAuthorized,
      // General Info
      general: {
        status: props.beneficiary.status,
        title: props.beneficiary.title,
        firstName: props.beneficiary?.firstName || '',
        usualName: props.beneficiary?.usualName,
        birthName: props.beneficiary?.birthName || '',
        birthDate: props.beneficiary.birthDate,
        birthPlace: props.beneficiary.birthPlace,
        deathDate: props.beneficiary.deathDate,
        gender: props.beneficiary.gender,
        nationality: props.beneficiary.nationality,
        numeroPegase: props.beneficiary.numeroPegase,
        accommodationMode: props.beneficiary.accommodationMode,
        accommodationName: props.beneficiary.accommodationName,
        accommodationAdditionalInformation:
          props.beneficiary.accommodationAdditionalInformation,
        zipcode: props.beneficiary.zipcode,
        city: props.beneficiary.city,
        region: props.beneficiary.region,
        addressComplement: props.beneficiary.addressComplement,
        accommodationZone: props.beneficiary.accommodationZone,
        streetNumber: props.beneficiary.streetNumber,
        street: props.beneficiary.street,
        noPhone: props.beneficiary.noPhone,
        phone1: props.beneficiary.phone1,
        phone2: props.beneficiary.phone2,
        email: props.beneficiary.email,
        caregiver: props.beneficiary.caregiver,
        mobility: props.beneficiary.mobility
      },

      // additionalInformation
      additionalInformation: props.beneficiary.additionalInformation
    }
  })

  const onSubmit = handleSubmit(values => {
    emit('saveBeneficiary', values)
  })

  const form = ref<HTMLFormElement>()

  const referentOptions = computed(() => toOptions(props.agents, 'id', 'name'))

  function onCheckValidationBeforeSubmit() {
    // Open the accordion containing the first invalid field
    const firstInvalidField = form.value?.querySelector(
      'input:invalid, select:invalid'
    )
    if (!firstInvalidField) {
      return
    }
    const closestAccordionCollapse = firstInvalidField.closest('.fr-collapse')
    if (!closestAccordionCollapse) {
      return
    }
    window.dsfr(closestAccordionCollapse as HTMLElement).collapse.disclose()
  }
</script>

<style lang="scss" scoped>
  .fr-accordions-group {
    margin-bottom: 1.5rem;
  }
</style>
