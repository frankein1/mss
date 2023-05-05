<template>
  <form
    ref="form"
    @submit.prevent="onSaveBeneficiary"
  >
    <AtomMultiSelect
      name="referents"
      label="Agent(s) référent(s)"
      :options="referentOptions"
      :model-value="initialReferentIds"
      required
      dropdown
      :readonly="!canSetReferents"
      :disabled-options="disabledReferentOptions"
    />

    <AtomCheckbox
      class="fr-mb-4w"
      label="Mandat Aidant Connect"
      name="aidant_connect_authorisation"
      :model-value="beneficiary && beneficiary.aidantConnectAuthorized"
    />

    <div
      ref="accordion"
      class="fr-accordions-group"
    >
      <BeneficiaryFormGeneralInformation :beneficiary="beneficiary" />
      <BeneficiaryFormRelatives
        v-if="canSetRelatives"
        :beneficiary="beneficiary"
        :relatives="taxHouseholdsData"
        household
        @add-relative="() => onAddRelative(true)"
        @remove-relative="$event => onRemoveRelative($event, true)"
        @change-family-situation="familySituation = $event"
        @change-major-children-nb="majorChildrenNb = $event"
      />
      <BeneficiaryFormRelatives
        v-if="canSetRelatives"
        :beneficiary="beneficiary"
        :relatives="entouragesData"
        :household="false"
        @add-relative="onAddRelative"
        @remove-relative="onRemoveRelative"
      />
      <BeneficiaryFormHealth
        v-if="canSetHealth"
        :beneficiary="beneficiary"
      />
      <BeneficiaryFormOccupationIncome
        v-if="canSetOccupationIncome"
        :beneficiary="beneficiary"
        :family-situation="familySituation"
        :major-children-nb="majorChildrenNb"
      />
      <BeneficiaryFormExternalOrganisations
        v-if="canSetExternalOrganisations"
        :beneficiary="beneficiary"
      />
    </div>

    <AtomTextarea
      v-if="canSetGeneralInformation"
      class="fr-col-12"
      name="additional_information"
      label="Informations complémentaires"
      hint
      :value="beneficiary?.additionalInformation || ''"
    >
      <template #hint>
        {{
          "Il est fortement recommandé de ne stocker que les informations utiles au suivi du bénéficiaire et d'éviter le recueil d'informations sensibles (données de santé, mots de passe, etc)."
        }}
      </template>
    </AtomTextarea>

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
  import { UserStatus } from '@prisma/client'
  import {
    BeneficiaryRelativeWithBeneficiary,
    BeneficiaryReferent,
    BeneficiaryWithReferents
  } from '~/utils/beneficiary'
  import {
    canUpdateBeneficiaryReferents,
    canEditBeneficiaryHealthInfo,
    canEditBeneficiaryOccupationIncome,
    canEditBeneficiaryExternalOrganisations,
    canEditBeneficiaryGeneralInformation,
    canUpdateBeneficiaryRelatives
  } from '~/server/query/security/rules'
  import { useAuthStore } from '~/store/auth'

  const props = defineProps<{
    beneficiary: BeneficiaryWithReferents
    taxHouseholds: BeneficiaryRelativeWithBeneficiary[]
    entourages: BeneficiaryRelativeWithBeneficiary[]
    isSubmitting: boolean
    agents: BeneficiaryReferent[]
  }>()

  // const emit = defineEmits(['saveBeneficiary'])

  const taxHouseholdsData = ref(props.taxHouseholds)
  const entouragesData = ref(props.entourages)
  const familySituation = ref('')
  const majorChildrenNb = ref(0)
  const form = ref<HTMLFormElement>()

  const referentOptions = computed(() =>
    withEmptyValue(toOptions(props.agents, 'id', 'name'))
  )

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

  const initialReferentIds = computed(() => {
    if (!isEditing.value) {
      return []
    }
    return props.beneficiary.referents.map(referent => referent.id)
  })

  const isEditing = computed(() => props.beneficiary)

  const authStore = useAuthStore()
  const user = authStore.getAuthUser

  const canSetRelatives = canUpdateBeneficiaryRelatives(user, props.beneficiary)
  const canSetReferents = canUpdateBeneficiaryReferents(user, props.beneficiary)
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

  onMounted(() => {
    if (isEditing.value) {
      familySituation.value = props.beneficiary.familySituation || ''
      majorChildrenNb.value = props.beneficiary.majorChildren || 0
    }
  })

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

  function onSaveBeneficiary(event: any) {
    console.log(event)
    // const beneficiary = beneficiaryFromForm(
    //   target,
    //   props.beneficiary,
    //   formHouseholdRelatives.value,
    //   formRelatives.value,
    //   permissionsStore.canSetRelatives
    // )
    // emit('saveBeneficiary', beneficiary)
  }

  function onAddRelative(household: boolean) {
    if (household) {
      taxHouseholdsData.value.push({
        id: getRandomId('tax-household')
      })
    } else {
      entouragesData.value.push({ id: getRandomId('entourage') })
    }
  }

  function onRemoveRelative(relativeId: string, household: boolean) {
    if (household) {
      taxHouseholdsData.value = taxHouseholdsData.value.filter(
        ({ id }) => id !== relativeId
      )
    } else {
      entouragesData.value = entouragesData.value.filter(
        ({ id }) => id !== relativeId
      )
    }
  }
</script>

<style lang="scss" scoped>
  .fr-accordions-group {
    margin-bottom: 1.5rem;
  }
</style>
