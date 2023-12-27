<template>
  <h3 class="fr-col-12 fr-h5 fr-mb-0">
    {{ headline }}
  </h3>

  <div class="fr-col-12">
    <VeeSelect
      name="status"
      :label="helpRequestFieldLabels.status"
      :options="helpRequestStatusOptions"
      required
    />
  </div>

  <template v-if="hasSetExternalStructure">
    <div
      v-if="isAnswered"
      class="fr-co-12 fr-col-lg-6"
      :class="{
        'fr-col-offset-lg-6--right': status === HelpRequestStatus.Refused
      }"
    >
      <VeeInput
        name="decisionDate"
        :label="helpRequestFieldLabels.decisionDate"
        type="date"
      />
    </div>

    <div
      v-if="status === HelpRequestStatus.Accepted"
      class="fr-col-12 fr-col-lg-6"
    >
      <VeeInput
        name="handlingDate"
        :label="helpRequestFieldLabels.handlingDate"
        type="date"
      />
    </div>

    <div
      v-if="status === HelpRequestStatus.Refused"
      class="fr-col-12"
    >
      <VeeSelect
        name="refusalReason"
        :label="helpRequestFieldLabels.refusalReason"
        :options="withEmptyValue(helpRequestRefusalReasonOptions)"
      />
    </div>
  </template>

  <div class="fr-col-12 fr-col-lg-6 fr-col-offset-lg-6--right">
    <VeeInput
      name="dueDate"
      :label="helpRequestFieldLabels.dueDate"
      type="date"
      hint="Notification le jour de l'échéance et à J-30."
    />
  </div>

  <!-- TODO: Rework financial part -->
  <template v-if="hasSetExternalStructure && isFinancialSupport">
    <div>
      <VeeCurrencyInput
        name="askedAmount"
        :label="helpRequestFieldLabels.askedAmount"
      />
    </div>

    <template v-if="status === HelpRequestStatus.Accepted">
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
  </template>
</template>

<script setup lang="ts">
  import { HelpRequestStatus, HelpRequestSubject } from '@prisma/client'
  import { helpRequestFieldLabels } from '~/client/labels/helpRequest.labels'
  import {
    paymentMethodOptions,
    helpRequestRefusalReasonOptions
  } from '~/client/options/helpRequest'
  import { withEmptyValue } from '~/utils/options'

  const { helpRequestStatusOptions } = useHelpRequestStatus()

  const props = defineProps<{
    status: HelpRequestStatus
    hasSetExternalStructure: boolean
    isExternalSupport: boolean
  }>()

  const { value: subject } = useField<HelpRequestSubject>('subject')

  const isAnswered = computed(
    () =>
      props.status === HelpRequestStatus.Accepted ||
      props.status === HelpRequestStatus.Refused
  )

  const isFinancialSupport = computed(
    () => subject.value === HelpRequestSubject.Financial
  )

  const headline = computed(() => {
    switch (subject.value) {
      case HelpRequestSubject.Financial:
        return "Informations sur l'aide financière"
      case HelpRequestSubject.Housing:
        return 'Informations sur la demande de logement'
      default:
        return "Informations sur le dossier d'instruction"
    }
  })
</script>
