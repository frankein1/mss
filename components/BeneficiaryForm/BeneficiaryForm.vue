<template>
  <form
    ref="form"
    @submit="onSubmit"
  >
    <div
      ref="accordion"
      class="fr-accordions-group"
    >
      <AccordionFieldset
        v-if="canSetRelatives"
        label="Foyer fiscal"
      >
        <BeneficiaryFormTaxHouseholds
          :current-beneficiary-id="currentBeneficiaryId"
        />
      </AccordionFieldset>
      <AccordionFieldset
        v-if="canSetRelatives"
        label="Entourage"
      >
        <BeneficiaryFormEntourages />
      </AccordionFieldset>
      <AccordionFieldset
        v-if="canSetHealth"
        label="Santé"
      >
        <BeneficiaryFormHealth />
      </AccordionFieldset>
      <AccordionFieldset
        v-if="canSetOccupationIncome"
        class="occupation-income-accordion-fieldset"
        label="Activité/Revenu"
      >
        <BeneficiaryFormOccupationIncome
          :family-situation="undefined"
          :major-children="undefined"
          :pension-organisations="values.occupation.pensionOrganisations"
        />
      </AccordionFieldset>

      <AccordionFieldset
        v-if="canSetExternalOrganisations"
        label="Structures extérieures"
      >
        <BeneficiaryFormExternalOrganisations />
      </AccordionFieldset>
    </div>

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
  import { BeneficiaryRelative } from '@prisma/client'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import BeneficiaryFormTaxHouseholds from './BeneficiaryFormTaxHouseholds.vue'
  import { BeneficiaryReferent } from '~/types/beneficiary'
  import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'
  import { SaveBeneficiaryInput, saveBeneficiarySchema } from '~/server/schema'

  const props = defineProps<{
    currentBeneficiaryId: string | null
    beneficiary: SaveBeneficiaryInput
    taxHouseholds: BeneficiaryRelativeWithLinkedBeneficiary[]
    entourages: BeneficiaryRelative[]
    isSubmitting: boolean
    agents: BeneficiaryReferent[]
    canSetReferents: boolean
    canSetExternalOrganisations: boolean
    canSetHealth: boolean
    canSetOccupationIncome: boolean
    canSetRelatives: boolean
  }>()

  const emit = defineEmits<{
    saveBeneficiary: [beneficiary: SaveBeneficiaryInput]
  }>()

  const { handleSubmit, values } = useForm<SaveBeneficiaryInput>({
    validationSchema: toTypedSchema(saveBeneficiarySchema),
    initialValues: {
      // external orga
      external: {
        ...props.beneficiary.external
      },
      // Health
      health: {
        ...props.beneficiary.health
      },
      // Occupation
      occupation: {
        ...props.beneficiary.occupation
      },
      entourage: {
        ...props.beneficiary.entourage
      }
    }
  })

  const onSubmit = handleSubmit(values => {
    emit('saveBeneficiary', values)
  })

  const form = ref<HTMLFormElement>()

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

  /* Allow to display ministere_departement_service_ac searchable select options within the accordion, as overflow is hidden */
  .occupation-income-accordion-fieldset.fr-accordion .fr-collapse--expanded {
    padding-bottom: 9.625rem;
  }
</style>
