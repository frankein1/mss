<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <form
    ref="form"
    novalidate
    class="fr-container--fluid"
    @submit.prevent="emit('submit', $event)"
  >
    <div class="fr-grid-row fr-grid-row--gutters form-grid fr-grid-row--bottom">
      <div class="fr-col-12 fr-col-lg-6">
        <VeeInput
          name="openingDate"
          :label="helpRequestFieldLabels.openingDate"
          type="date"
          required
        />
      </div>

      <template v-if="isMinistryAgent">
        <div>
          <VeeInput
            name="numeroPegase"
            :label="helpRequestFieldLabels.numeroPegase"
            hint="Format attendu : A-00-000000"
          />
        </div>

        <VeeSelect
          name="ministre"
          :label="helpRequestFieldLabels.ministre"
          :options="withEmptyValue(ministerOptions)"
        />
      </template>

      <div class="fr-col-12 fr-col-lg-6">
        <VeeSearchableSelect
          :label="helpRequestFieldLabels.typeId"
          name="typeId"
          :options="followUpTypeOptions"
          required
          hint
        >
          <template #hint>
            <span class="fr-icon-information-line fr-fi--sm">
              <NuxtLink
                v-if="allowEditStructure"
                :to="RoutePath.AppStructureEdit()"
                target="_self"
              >
                Personnaliser les objets des instructions de ma structure.
              </NuxtLink>
              <template v-else>
                Les responsables de votre structure peuvent personnaliser ces
                objets d'instruction.
              </template>
            </span>
          </template>
        </VeeSearchableSelect>
      </div>

      <div>
        <VeeSearchableSelect
          :label="helpRequestFieldLabels.prescribingOrganizationId"
          name="prescribingOrganizationId"
          :options="withEmptyValue(prescribingOrganizationOptions)"
          :can-create-new-option="canCreatePrescribingOrganization"
        />
      </div>

      <div>
        <VeeSelect
          name="status"
          :label="helpRequestFieldLabels.status"
          :options="helpRequestStatusOptions"
          :disabled-options="pastStatuses"
        />
      </div>

      <div>
        <VeeCheckbox
          name="fullFile"
          :label="helpRequestFieldLabels.fullFile"
        />
      </div>

      <div
        class="fr-col-12 fr-col-lg-6"
        :class="{ 'fr-col-offset-lg-6--right': !isFinancialSupport }"
      >
        <VeeSelect
          label="S'agit-il d'une aide financière ?"
          name="financialSupport"
          :options="withEmptyValue(financialSupportOptions)"
          required
          :disabled="isEditing"
        />
      </div>

      <div v-if="isFinancialSupport">
        <VeeSelect
          name="reason"
          :label="helpRequestFieldLabels.reason"
          :options="withEmptyValue(helpRequestReasonOptions)"
          :disabled="isEditingAndIsLocked"
        />
      </div>

      <div
        class="fr-col-12 fr-col-lg-6"
        :class="{
          'fr-col-offset-lg-6--right': !isExternalSupport
        }"
      >
        <VeeSelect
          label="L'instruction du dossier est réalisée..."
          name="externalStructure"
          :options="withEmptyValue(externalOrganisationOptions)"
          required
          :disabled="isEditing"
        />
      </div>

      <div v-if="isExternalSupport">
        <VeeSearchableSelect
          :label="helpRequestFieldLabels.instructorOrganizationId"
          name="instructorOrganizationId"
          :options="instructorOrganizationOptions"
          :readonly="isEditingAndIsLocked"
          :can-create-new-option="canCreateInstructorOrganization"
        />
      </div>

      <template v-if="externalStructure && financialSupport">
        <div v-if="isFinancialSupport">
          <VeeCurrencyInput
            name="askedAmount"
            :label="helpRequestFieldLabels.askedAmount"
            :readonly="isEditingAndIsLocked"
          />
        </div>

        <template v-if="afterInvestigationOngoing">
          <div v-if="isExternalSupport">
            <VeeInput
              name="dispatchDate"
              :label="helpRequestFieldLabels.dispatchDate"
              type="date"
              :readonly="isEditingAndIsLocked"
            />
          </div>

          <div v-if="!isExternalSupport">
            <VeeInput
              name="examinationDate"
              :label="helpRequestFieldLabels.examinationDate"
              type="date"
              :readonly="isEditingAndIsLocked"
            />
          </div>
        </template>

        <div v-if="isAnswered">
          <VeeInput
            name="decisionDate"
            :label="helpRequestFieldLabels.decisionDate"
            type="date"
          />
        </div>

        <template v-if="status === HelpRequestStatus.Accepted">
          <template v-if="isFinancialSupport">
            <div>
              <VeeCurrencyInput
                name="allocatedAmount"
                :label="helpRequestFieldLabels.allocatedAmount"
              />
            </div>

            <template v-if="!isExternalSupport">
              <div>
                <VeeSelect
                  name="paymentMethod"
                  :label="helpRequestFieldLabels.paymentMethod"
                  :options="withEmptyValue(paymentMethodOptions)"
                />
              </div>

              <div>
                <VeeInput
                  name="paymentDate"
                  :label="helpRequestFieldLabels.paymentDate"
                  type="date"
                />
              </div>
            </template>
          </template>

          <div>
            <VeeInput
              name="handlingDate"
              :label="helpRequestFieldLabels.handlingDate"
              type="date"
            />
          </div>
        </template>

        <div v-if="status === HelpRequestStatus.Refused">
          <VeeInput
            name="refusalReason"
            :label="helpRequestFieldLabels.refusalReason"
          />
        </div>
      </template>

      <div>
        <VeeInput
          name="dueDate"
          :label="helpRequestFieldLabels.dueDate"
          type="date"
          :readonly="isDropped"
        />
      </div>

      <div class="fr-col-12">
        <VeeTextarea
          class="large-textarea"
          name="synthesis"
          :label="helpRequestFieldLabels.synthesis"
        />
      </div>

      <div
        v-if="canEditPrivateSynthesis"
        class="fr-col-12 fr-mb-6v"
      >
        <VeeTextarea
          name="privateSynthesis"
          :label="helpRequestFieldLabels.privateSynthesis"
          label-icon="fr-icon-lock-line"
        >
          <template #hint>
            Le compte rendu privé est uniquement visible et modifiable par
            l'agent qui instruit le dossier.<br />{{ SENSITIVE_DATA_HINT }}
          </template>
        </VeeTextarea>
      </div>
    </div>

    <BeneficiaryDocumentsSelect
      class="fr-mb-4w"
      :beneficiary-id="beneficiaryId"
      name="documents"
      :label="helpRequestFieldLabels.documents"
      snackbar-success-message="Le document a été ajouté à la fiche bénéficiaire. Enregistrez l'instruction de dossier pour conserver le lien entre les deux."
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
  import type { FormErrors } from 'vee-validate'
  import {
    externalOrganisationOptions,
    financialSupportOptions,
    helpRequestReasonOptions,
    paymentMethodOptions
  } from '~/client/options/helpRequest'
  import { ministerOptions } from '~/client/options/ministry'
  import {
    canCreatePrescribingOrganization as canCreatePrescribingOrganizationRule,
    canEditStructure,
    canCreateInstructorOrganization as canCreateInstructorOrganizationRule
  } from '~/server/security'
  import { SENSITIVE_DATA_HINT } from '~/utils/constants'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { RoutePath } from '~/utils/routing'
  import { helpRequestFieldLabels } from '~/client/labels/helpRequest.labels'
  import { CreateHelpRequestInput, EditHelpRequestInput } from '~/server/schema'
  import { useDisplayFormErrors } from '~/composables/useDisplayFormErrors'

  const isMinistryAgent = useAuthState().isMinistryAgent()
  const { helpRequestStatusOptions } = useHelpRequestStatus()

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
      canEditPrivateSynthesis?: boolean
      caughtErrors: FormErrors<CreateHelpRequestInput | EditHelpRequestInput>
    }>(),
    { pastStatuses: undefined, isEditing: false, canEditPrivateSynthesis: true }
  )

  const form = ref<HTMLFormElement | null>(null)

  const { errors } = useDisplayFormErrors(
    form,
    toRef(() => props.caughtErrors),
    helpRequestFieldLabels
  )

  const emit = defineEmits<{
    submit: [payload: Event]
  }>()

  const { user } = useAuthState()

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
      props.status === HelpRequestStatus.ClosedByAgent ||
      props.status === HelpRequestStatus.Dismissed
  )

  const isEditingAndIsLocked = computed(
    () => props.isEditing && (isAnswered.value || isDropped.value)
  )

  const allowEditStructure = computed(() => canEditStructure(user.value))

  const canCreatePrescribingOrganization = computed(() =>
    canCreatePrescribingOrganizationRule(user.value)
  )

  const canCreateInstructorOrganization = computed(() =>
    canCreateInstructorOrganizationRule(user.value)
  )
</script>
