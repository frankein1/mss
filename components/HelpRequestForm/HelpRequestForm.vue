<template>
  <form
    ref="form"
    class="fr-container--fluid"
    @submit="onSubmit"
  >
    <div class="fr-grid-row fr-grid-row--gutters form-grid">
      <VeeInput
        class="fr-col-12 fr-col-lg-6"
        name="openingDate"
        label="Date d'ouverture du dossier"
        type="date"
        required
      />

      <VeeInput
        v-if="isMinistryAgent"
        name="numeroPegase"
        label="Numéro Pégase"
      />

      <VeeSelect
        v-if="isMinistryAgent"
        name="ministre"
        label="Ministre"
        :options="withEmptyValue(ministerOptions)"
      />

      <VeeSearchableSelect
        class="fr-col-12 fr-col-lg-6"
        label="Objet de la demande"
        name="typeId"
        :options="followUpTypeOptions"
        required
        hint
      >
        <template #hint>
          <span class="fr-icon-information-line fr-fi--sm">
            <NuxtLink
              v-if="canEditStructure"
              :to="Routes.StructureEdit()"
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
        label="Organisme prescripteur"
        name="prescribingOrganizationId"
        :options="withEmptyValue(prescribingOrganizationOptions)"
        :can-create-new-option="canCreateOrganisme"
      />

      <VeeSelect
        name="status"
        label="Statut"
        :options="helpRequestStatusOptions"
        :disabled-options="pastStatuses"
      />

      <VeeCheckbox
        name="fullFile"
        label="Dossier complet"
      />

      <VeeSelect
        class="fr-col-12 fr-col-lg-6"
        :class="{ 'fr-col-offset-lg-6--right': !isFinancialSupport }"
        label="S'agit-il d'une aide financière ?"
        name="financialSupport"
        :options="withEmptyValue(financialSupportOptions)"
        required
        :disabled="!!props.helpRequest"
      />

      <VeeSelect
        v-if="isFinancialSupport"
        name="reason"
        label="Motif"
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
        :disabled="!!props.helpRequest"
      />

      <VeeSearchableSelect
        v-if="isExternalSupport"
        label="Organisme instructeur"
        name="instructorOrganizationId"
        :options="instructorOrganizationOptions"
        :readonly="isEditingAndIsLocked"
        :can-create-new-option="canCreateOrganisme"
      />

      <template v-if="values.externalStructure && values.financialSupport">
        <VeeCurrencyInput
          v-if="isFinancialSupport"
          name="askedAmount"
          label="Montant demandé"
          :readonly="isEditingAndIsLocked"
        />

        <template v-if="afterInvestigationOngoing">
          <VeeInput
            v-if="isExternalSupport"
            name="dispatchDate"
            label="Date d'envoi du dossier"
            type="date"
            :readonly="isEditingAndIsLocked"
          />

          <VeeInput
            v-if="!isExternalSupport"
            name="examinationDate"
            label="Date de passage en commission"
            type="date"
            :readonly="isEditingAndIsLocked"
          />
        </template>

        <VeeInput
          v-if="isAnswered"
          name="decisionDate"
          label="Date de la décision"
          type="date"
        />

        <template v-if="values.status === HelpRequestStatus.Accepted">
          <template v-if="isFinancialSupport">
            <VeeCurrencyInput
              name="allocatedAmount"
              label="Montant attribué"
            />

            <template v-if="!isExternalSupport">
              <VeeSelect
                name="paymentMethod"
                label="Mode de paiement"
                :options="withEmptyValue(paymentMethodOptions)"
              />

              <VeeInput
                name="paymentDate"
                label="Date du paiement"
                type="date"
              />
            </template>
          </template>

          <VeeInput
            name="handlingDate"
            label="Date de fin de prise en charge"
            type="date"
          />
        </template>

        <VeeInput
          v-if="values.status === HelpRequestStatus.Refused"
          name="refusalReason"
          label="Motif du refus"
        />
      </template>

      <VeeInput
        name="dueDate"
        label="Date d'échéance"
        type="date"
        :readonly="isDropped"
      />

      <VeeTextarea
        class="fr-col-12 large-textarea"
        name="synthesis"
        label="Compte rendu"
      />

      <VeeTextarea
        v-if="isOwnedByCurrentUser"
        class="fr-col-12 fr-mb-6v"
        name="privateSynthesis"
        label="Compte rendu privé"
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
      label="Documents"
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
    Document,
    FollowupType,
    HelpRequest,
    HelpRequestStatus,
    InstructorOrganization,
    PrescribingOrganization,
    Prisma
  } from '@prisma/client'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import {
    externalOrganisationOptions,
    financialSupportOptions,
    helpRequestReasonOptions,
    helpRequestStatusOptions,
    paymentMethodOptions
  } from '~/client/options/helpRequest'
  import { ministerOptions } from '~/client/options/ministry'
  import {
    CreateHelpRequestInput,
    EditHelpRequestInput,
    createHelpRequestSchema,
    editHelpRequestSchema
  } from '~/server/schema/helpRequest.schema'
  import {
    canCreatePrescribingOrganization,
    isCreator
  } from '~/server/query/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { SENSITIVE_DATA_HINT } from '~/utils/constants'
  import { pastStatusesFromStatus } from '~/utils/helpRequest/pastStatusesFromStatus'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { Routes } from '~/utils/routing/routes'

  const authStore = useAuthStore()
  const user = authStore.getAuthUser

  const props = withDefaults(
    defineProps<{
      isSubmitting: boolean
      followUpTypes: FollowupType[]
      prescribingOrganizations: PrescribingOrganization[]
      instructorOrganizations: InstructorOrganization[]
      helpRequest?: (HelpRequest & { documents: Document[] }) | null
      beneficiaryId: string
    }>(),
    {
      helpRequest: null
    }
  )

  type SubmitType = typeof props.helpRequest extends undefined
    ? CreateHelpRequestInput
    : EditHelpRequestInput

  const emit = defineEmits<{
    (e: 'saveHelpRequest', helpRequest: SubmitType): void
  }>()

  const form = ref<HTMLFormElement | null>(null)

  const followUpTypeOptions = computed(() =>
    toOptions(props.followUpTypes, 'id', 'name')
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

  const isFinancialSupport = computed(() => values.financialSupport === 'true')

  const isExternalSupport = computed(() => values.externalStructure === 'true')

  const afterInvestigationOngoing = computed(
    () => values.status !== HelpRequestStatus.WaitingAdditionalInformation
  )

  const isAnswered = computed(
    () =>
      values.status === HelpRequestStatus.Accepted ||
      values.status === HelpRequestStatus.Refused
  )

  const isDropped = computed(
    () =>
      values.status === HelpRequestStatus.ClosedByBeneficiary ||
      values.status === HelpRequestStatus.Dismissed
  )

  const isEditingAndIsLocked = computed(
    () => !!(props.helpRequest && (isAnswered.value || isDropped.value))
  )

  const pastStatuses = computed(() => {
    if (!props.helpRequest) {
      return []
    }
    return pastStatusesFromStatus(props.helpRequest.status)
  })

  const isOwnedByCurrentUser = computed(() =>
    isCreator(user, props.helpRequest, [
      'Administrator',
      'StructureManager',
      'SocialWorker',
      'Instructor',
      'ReceptionAgent',
      'Referent'
    ])
  )

  const canEditStructure = computed(() => authStore.isResponsableDeStructure)

  const initialDocumentIds = computed(
    () => props.helpRequest?.documents.map(d => d.key) || []
  )

  const canCreateOrganisme = computed(() =>
    canCreatePrescribingOrganization(user)
  )

  const { handleSubmit, values } = useForm<SubmitType>({
    validationSchema: toTypedSchema(
      props.helpRequest?.id ? editHelpRequestSchema : createHelpRequestSchema
    ),
    initialValues: {
      id: props.helpRequest?.id,
      beneficiaryId: props.beneficiaryId,
      // FIXME: date type error
      openingDate: props.helpRequest?.openingDate || new Date(),
      typeId: props.helpRequest?.typeId,
      documents: initialDocumentIds.value,
      financialSupport: props.helpRequest?.financialSupport ? 'true' : 'false',
      externalStructure: props.helpRequest?.externalStructure
        ? 'true'
        : 'false',
      status:
        props.helpRequest?.status ||
        HelpRequestStatus.WaitingAdditionalInformation,
      askedAmount: props.helpRequest?.askedAmount
        ? new Prisma.Decimal(props.helpRequest?.askedAmount).toNumber()
        : undefined,
      // FIXME: date type error
      examinationDate: props.helpRequest?.examinationDate,
      // FIXME: date type error
      decisionDate: props.helpRequest?.decisionDate,
      allocatedAmount: props.helpRequest?.allocatedAmount
        ? new Prisma.Decimal(props.helpRequest?.allocatedAmount).toNumber()
        : undefined,
      paymentMethod: props.helpRequest?.paymentMethod,
      reason: props.helpRequest?.reason,
      // FIXME: date type error
      paymentDate: props.helpRequest?.paymentDate,
      // FIXME: date type error
      handlingDate: props.helpRequest?.handlingDate,
      refusalReason: props.helpRequest?.refusalReason,
      prescribingOrganizationId: props.helpRequest?.prescribingOrganizationId,
      instructorOrganizationId: props.helpRequest?.instructorOrganizationId,
      // FIXME: date type error
      dispatchDate: props.helpRequest?.dispatchDate,
      synthesis: props.helpRequest?.synthesis,
      privateSynthesis: props.helpRequest?.privateSynthesis,
      // FIXME: date type error
      dueDate: props.helpRequest?.dueDate,
      fullFile: props.helpRequest?.fullFile || false,
      numeroPegase: props.helpRequest?.numeroPegase,
      ministre: props.helpRequest?.ministre
    }
  })

  const onSubmit = handleSubmit(values => {
    emit('saveHelpRequest', values)
  })
</script>
