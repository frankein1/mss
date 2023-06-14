<template>
  <form
    class="fr-container--fluid"
    @submit="emit('submit', $event)"
  >
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <VeeInput
        class="fr-col-12 fr-col-lg-6"
        name="openingDate"
        :label="helpRequestFieldLabels.openingDate"
        type="date"
        required
      />

      <VeeInput
        v-if="isMinistryAgent"
        name="numeroPegase"
        :label="helpRequestFieldLabels.numeroPegase"
      />

      <VeeSelect
        v-if="isMinistryAgent"
        name="ministre"
        :label="helpRequestFieldLabels.ministre"
        :options="withEmptyValue(ministerOptions)"
      />

      <VeeSearchableSelect
        class="fr-col-12 fr-col-lg-6"
        :label="helpRequestFieldLabels.typeId"
        name="typeId"
        :options="followUpTypeOptions"
        required
        hint
      >
        <template #hint>
          <span class="fr-icon-information-line fr-fi--sm">
            <NuxtLink
              v-if="canEditStructure"
              :to="RoutePath.StructureEdit()"
              target="_self"
            >
              Personnaliser les objets des demandes de ma structure.
            </NuxtLink>
            <template v-else>
              Les responsables de votre structure peuvent personnaliser ces
              objets des demandes.
            </template>
          </span>
        </template>
      </VeeSearchableSelect>

      <VeeSearchableSelect
        :label="helpRequestFieldLabels.prescribingOrganizationId"
        name="prescribingOrganizationId"
        :options="withEmptyValue(prescribingOrganizationOptions)"
        :can-create-new-option="canCreateOrganisme"
      />

      <VeeSelect
        name="status"
        :label="helpRequestFieldLabels.status"
        :options="helpRequestStatusOptions"
        :disabled-options="pastStatuses"
      />

      <VeeCheckbox
        name="fullFile"
        :label="helpRequestFieldLabels.fullFile"
      />

      <VeeSelect
        class="fr-col-12 fr-col-lg-6"
        :class="{ 'fr-col-offset-lg-6--right': !isFinancialSupport }"
        label="S'agit-il d'une aide financière ?"
        name="financialSupport"
        :options="withEmptyValue(financialSupportOptions)"
        required
        :disabled="isEditing"
      />

      <VeeSelect
        v-if="isFinancialSupport"
        name="reason"
        :label="helpRequestFieldLabels.reason"
        :options="withEmptyValue(helpRequestReasonOptions)"
        :disabled="isEditingAndIsLocked"
      />

      <VeeSelect
        class="fr-col-12 fr-col-lg-6"
        :class="{
          'fr-col-offset-lg-6--right': !isExternalSupport
        }"
        label="L'instruction de la demande est réalisée..."
        name="externalStructure"
        :options="withEmptyValue(externalOrganisationOptions)"
        required
        :disabled="isEditing"
      />

      <VeeSearchableSelect
        v-if="isExternalSupport"
        :label="helpRequestFieldLabels.instructorOrganizationId"
        name="instructorOrganizationId"
        :options="instructorOrganizationOptions"
        :readonly="isEditingAndIsLocked"
        :can-create-new-option="canCreateOrganisme"
      />

      <template v-if="externalStructure && financialSupport">
        <VeeCurrencyInput
          v-if="isFinancialSupport"
          name="askedAmount"
          :label="helpRequestFieldLabels.askedAmount"
          :readonly="isEditingAndIsLocked"
        />

        <template v-if="afterInvestigationOngoing">
          <VeeInput
            v-if="isExternalSupport"
            name="dispatchDate"
            :label="helpRequestFieldLabels.dispatchDate"
            type="date"
            :readonly="isEditingAndIsLocked"
          />

          <VeeInput
            v-if="!isExternalSupport"
            name="examinationDate"
            :label="helpRequestFieldLabels.examinationDate"
            type="date"
            :readonly="isEditingAndIsLocked"
          />
        </template>

        <VeeInput
          v-if="isAnswered"
          name="decisionDate"
          :label="helpRequestFieldLabels.decisionDate"
          type="date"
        />

        <template v-if="status === HelpRequestStatus.Accepted">
          <template v-if="isFinancialSupport">
            <VeeCurrencyInput
              name="allocatedAmount"
              :label="helpRequestFieldLabels.allocatedAmount"
            />

            <template v-if="!isExternalSupport">
              <VeeSelect
                name="paymentMethod"
                :label="helpRequestFieldLabels.paymentMethod"
                :options="withEmptyValue(paymentMethodOptions)"
              />

              <VeeInput
                name="paymentDate"
                :label="helpRequestFieldLabels.paymentDate"
                type="date"
              />
            </template>
          </template>

          <VeeInput
            name="handlingDate"
            :label="helpRequestFieldLabels.handlingDate"
            type="date"
          />
        </template>

        <VeeInput
          v-if="status === HelpRequestStatus.Refused"
          name="refusalReason"
          :label="helpRequestFieldLabels.refusalReason"
        />
      </template>

      <VeeInput
        name="dueDate"
        :label="helpRequestFieldLabels.dueDate"
        type="date"
        :readonly="isDropped"
      />

      <VeeTextarea
        class="fr-col-12 large-textarea"
        name="synthesis"
        :label="helpRequestFieldLabels.synthesis"
      />

      <VeeTextarea
        v-if="isOwnedByCurrentUser"
        class="fr-col-12 fr-mb-6v"
        name="privateSynthesis"
        :label="helpRequestFieldLabels.privateSynthesis"
        label-icon="fr-icon-lock-line"
        hint
      >
        <template #hint>
          Le compte rendu privé est uniquement visible et modifiable par l'agent
          qui crée l'instruction de demande d'aide.<br />{{
            SENSITIVE_DATA_HINT
          }}
        </template>
      </VeeTextarea>
    </div>

    <BeneficiaryDocumentsSelect
      class="fr-mb-4w"
      :beneficiary-id="beneficiaryId"
      name="documents"
      :label="helpRequestFieldLabels.documents"
    />

    <ul
      class="fr-btns-group fr-btns-group--inline fr-btns-group--lg fr-btns-group--right"
    >
      <li>
        <button
          class="fr-btn submit-btn"
          type="submit"
          :submitting="isSubmitting"
          :disabled="isSubmitting"
        >
          Enregistrer
        </button>
      </li>
    </ul>
  </form>
</template>

<script lang="ts" setup>
  import {
    FollowupType,
    HelpRequestStatus,
    InstructorOrganization,
    PrescribingOrganization
  } from '@prisma/client'
  import {
    externalOrganisationOptions,
    financialSupportOptions,
    helpRequestReasonOptions,
    helpRequestStatusOptions,
    paymentMethodOptions
  } from '~/client/options/helpRequest'
  import { ministerOptions } from '~/client/options/ministry'
  import {
    canCreatePrescribingOrganization,
    canEditStructure as canEditStructureRule
  } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { SENSITIVE_DATA_HINT } from '~/utils/constants'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { RoutePath } from '~/utils/routing'
  import { helpRequestFieldLabels } from '~/client/labels/helpRequest.labels'

  const authStore = useAuthStore()
  const user = authStore.getAuthUser

  const props = withDefaults(
    defineProps<{
      isSubmitting: boolean
      followupTypes: FollowupType[]
      prescribingOrganizations: PrescribingOrganization[]
      instructorOrganizations: InstructorOrganization[]
      beneficiaryId: string
      status: HelpRequestStatus
      externalStructure: 'true' | 'false' | undefined
      financialSupport: 'true' | 'false' | undefined
      pastStatuses?: HelpRequestStatus[]
      isEditing?: boolean
      isOwnedByCurrentUser?: boolean
    }>(),
    { pastStatuses: undefined, isEditing: false, isOwnedByCurrentUser: true }
  )

  const emit = defineEmits<{
    (e: 'submit', payload: Event): void
  }>()

  const followUpTypeOptions = computed(() =>
    toOptions(props.followupTypes, 'id', 'name')
  )

  const prescribingOrganizationOptions = computed(() => {
    const prescribingOrganizationsWithStringId =
      props.prescribingOrganizations.map(({ id, ...rest }) => ({
        id: String(id),
        ...rest
      }))
    return toOptions(prescribingOrganizationsWithStringId, 'id', 'name')
  })

  const instructorOrganizationOptions = computed(() => {
    const instructorOrganizationsWithStringId =
      props.instructorOrganizations.map(({ id, ...rest }) => ({
        id: String(id),
        ...rest
      }))
    return toOptions(instructorOrganizationsWithStringId, 'id', 'name')
  })

  const isMinistryAgent = computed(() => authStore.isMinistryAgent)

  const isFinancialSupport = computed(() => props.financialSupport === 'true')

  const isExternalSupport = computed(() => props.externalStructure === 'true')

  const afterInvestigationOngoing = computed(
    () => props.status !== HelpRequestStatus.WaitingAdditionalInformation
  )

  const isAnswered = computed(
    () =>
      props.status === HelpRequestStatus.Accepted ||
      props.status === HelpRequestStatus.Refused
  )

  const isDropped = computed(
    () =>
      props.status === HelpRequestStatus.ClosedByBeneficiary ||
      props.status === HelpRequestStatus.Dismissed
  )

  const isEditingAndIsLocked = computed(
    () => props.isEditing && (isAnswered.value || isDropped.value)
  )

  const canEditStructure = computed(() =>
    canEditStructureRule(user, { structureId: user.structureId })
  )

  const canCreateOrganisme = computed(() =>
    canCreatePrescribingOrganization(user)
  )
</script>
