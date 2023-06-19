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
        <BeneficiaryFormGeneralInformation :values="values" />
      </AccordionFieldset>

      <AccordionFieldset
        v-if="canSetRelatives"
        label="Foyer fiscal"
      >
        <BeneficiaryFormFamilySituation />
        <BeneficiaryFormTaxHouseholds
          :current-beneficiary-id="beneficiary.id"
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
        <BeneficiaryFormOccupationIncome :values="values" />
      </AccordionFieldset>

      <AccordionFieldset
        v-if="canSetExternalOrganisations"
        label="Structures extérieures"
      >
        <BeneficiaryFormExternalOrganisations />
      </AccordionFieldset>
    </div>

    <VeeTextarea
      v-if="canSetGeneralInformation"
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
  import {
    UpdateBeneficiaryInput,
    updateBeneficiarySchema
  } from '~/server/schema/beneficiary.schema'
  import {
    canEditBeneficiaryHealthInfo,
    canEditBeneficiaryReferents,
    canEditBeneficiaryOccupationIncome,
    canEditBeneficiaryExternalOrganisations,
    canEditBeneficiaryGeneralInformation,
    canEditBeneficiaryRelatives
  } from '~/server/security/rules'
  import type { GetBeneficiaryOutput } from '~/server/routers'

  import { useAuthStore } from '~/store/auth'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
    taxHouseholds: BeneficiaryRelativeWithLinkedBeneficiary[]
    entourages: BeneficiaryRelative[]
    isSubmitting: boolean
    agents: BeneficiaryReferent[]
  }>()

  const emit = defineEmits<{
    (e: 'saveBeneficiary', beneficiary: UpdateBeneficiaryInput): void
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
      // external orga
      external: {
        protectionMeasure: props.beneficiary.protectionMeasure,
        representative: props.beneficiary.representative,
        prescribingStructure: props.beneficiary.prescribingStructure,
        orientationType: props.beneficiary.orientationType,
        orientationStructure: props.beneficiary.orientationStructure,
        serviceProviders: props.beneficiary.serviceProviders,
        involvedPartners: props.beneficiary.involvedPartners
      },
      // Health
      health: {
        gir: props.beneficiary.gir,
        doctor: props.beneficiary.doctor,
        healthAdditionalInformation:
          props.beneficiary.healthAdditionalInformation,
        socialSecurityNumber: props.beneficiary.socialSecurityNumber,
        insurance: props.beneficiary.insurance
      },
      // Occupation
      occupation: {
        socioProfessionalCategory: props.beneficiary.socioProfessionalCategory,
        occupation: props.beneficiary.occupation,
        employer: props.beneficiary.employer,
        employerSiret: props.beneficiary.employerSiret,
        mainIncomeSource: props.beneficiary.mainIncomeSource || [],
        mainIncomeAmount: props.beneficiary.mainIncomeAmount,
        partnerMainIncomeSource:
          props.beneficiary.partnerMainIncomeSource || [],
        partnerMainIncomeAmount: props.beneficiary.partnerMainIncomeAmount,
        majorChildrenMainIncomeSource:
          props.beneficiary.majorChildrenMainIncomeSource || [],
        majorChildrenMainIncomeAmount:
          props.beneficiary.majorChildrenMainIncomeAmount,
        unemploymentNumber: props.beneficiary.unemploymentNumber,
        pensionOrganisations: props.beneficiary.pensionOrganisations || [],
        otherPensionOrganisations: props.beneficiary.otherPensionOrganisations,
        cafNumber: props.beneficiary.cafNumber,
        bank: props.beneficiary.bank,
        funeralContract: props.beneficiary.funeralContract,
        ministereCategorie: props.beneficiary.ministereCategorie,
        ministereDepartementServiceAc:
          props.beneficiary.ministereDepartementServiceAc,
        ministereStructure: props.beneficiary.ministereStructure
      },
      // Relatives
      taxHousehold: {
        familySituation: props.beneficiary.familySituation,
        minorChildren: props.beneficiary.minorChildren,
        majorChildren: props.beneficiary.majorChildren,
        taxHouseholds: props.taxHouseholds || []
      },
      entourage: {
        entourages: props.entourages || []
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
        ).some(referent => referent.id === agent.id)
        return disabledAgent && !agentIsBeneficiaryReferent
          ? [...disabledOptions, agent.id]
          : disabledOptions
      },
      []
    )
  )

  const authStore = useAuthStore()
  const user = authStore.getAuthUser

  const canSetRelatives = canEditBeneficiaryRelatives(user, props.beneficiary)
  const canSetReferents = canEditBeneficiaryReferents(user, props.beneficiary)
  const canSetHealth = canEditBeneficiaryHealthInfo(user, props.beneficiary)
  const canSetOccupationIncome = canEditBeneficiaryOccupationIncome(
    user,
    props.beneficiary
  )
  const canSetExternalOrganisations = canEditBeneficiaryExternalOrganisations(
    user,
    props.beneficiary
  )

  const canSetGeneralInformation = canEditBeneficiaryGeneralInformation(
    user,
    props.beneficiary
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
