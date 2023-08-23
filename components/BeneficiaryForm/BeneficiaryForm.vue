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
      :readonly="!canSetReferents"
      :disabled-options="disabledReferentOptions"
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

      <AccordionFieldset
        v-if="canSetRelatives"
        label="Foyer fiscal"
      >
        <BeneficiaryFormFamilySituation />
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
          :family-situation="values.taxHousehold.familySituation"
          :major-children="values.taxHousehold.majorChildren"
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
  import { UserStatus, BeneficiaryRelative } from '@prisma/client'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import BeneficiaryFormTaxHouseholds from './BeneficiaryFormTaxHouseholds.vue'
  import { BeneficiaryReferent } from '~/types/beneficiary'
  import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'
  import { SaveBeneficiaryInput, saveBeneficiarySchema } from '~/server/schema'
  import { toOptions } from '~/utils/options'

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
      referents: props.beneficiary.referents,
      aidantConnectAuthorized: props.beneficiary.aidantConnectAuthorized,
      // General Info
      general: {
        ...props.beneficiary.general
      },
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
      // Relatives
      taxHousehold: {
        ...props.beneficiary.taxHousehold
      },
      entourage: {
        ...props.beneficiary.entourage
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

  const disabledReferentOptions = computed(() =>
    props.agents.reduce(
      (disabledOptions: string[], agent: BeneficiaryReferent) => {
        const disabledAgent = agent.status !== UserStatus.Active
        const agentIsBeneficiaryReferent = (
          props.beneficiary?.referents || []
        ).includes(agent.id)
        return disabledAgent && !agentIsBeneficiaryReferent
          ? [...disabledOptions, agent.id]
          : disabledOptions
      },
      []
    )
  )

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
