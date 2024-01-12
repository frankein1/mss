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

  <div
    v-if="isFinancialSupport"
    class="fr-col-12 fr-col-lg-6 fr-col-offset-lg-6--right"
  >
    <VeeSelect
      name="isRefundable"
      :label="helpRequestFieldLabels.isRefundable"
      :options="withEmptyValue(isRefundableOptions)"
    />
  </div>

  <template v-if="hasSetExternalStructure">
    <div
      v-if="isFinancialSupport"
      class="fr-col-12 fr-col-lg-6"
      :class="{
        'fr-col-offset-lg-6--right': !isAnswered
      }"
    >
      <VeeCurrencyInput
        name="askedAmount"
        :label="helpRequestFieldLabels.askedAmount"
      />
    </div>

    <div
      v-if="isAnswered"
      class="fr-co-12 fr-col-lg-6"
      :class="{
        'fr-col-offset-lg-6--right': isRefused && !isFinancialSupport
      }"
    >
      <VeeInput
        name="decisionDate"
        :label="helpRequestFieldLabels.decisionDate"
        type="date"
      />
    </div>

    <template v-if="isAccepted">
      <div
        v-if="isFinancialSupport"
        class="fr-co-12 fr-col-lg-6"
      >
        <VeeCurrencyInput
          name="allocatedAmount"
          :label="helpRequestFieldLabels.allocatedAmount"
        />
      </div>

      <div class="fr-col-12 fr-col-lg-6">
        <VeeInput
          name="handlingDate"
          :label="helpRequestFieldLabels.handlingDate"
          type="date"
        />
      </div>

      <template v-if="isFinancialSupport && !isExternalSupport">
        <div class="fr-col-12 fr-col-lg-6">
          <VeeSelect
            name="paymentMethod"
            :label="helpRequestFieldLabels.paymentMethod"
            :options="withEmptyValue(paymentMethodOptions)"
          />
        </div>

        <div class="fr-col-12 fr-col-lg-6">
          <VeeInput
            name="paymentDate"
            :label="helpRequestFieldLabels.paymentDate"
            type="date"
          />
        </div>
      </template>
    </template>

    <div
      v-if="isRefused"
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
</template>

<script setup lang="ts">
  import { SocialSupportStatus, HelpRequestSubject } from '@prisma/client'
  import { helpRequestFieldLabels } from '~/client/labels/helpRequest.labels'
  import {
    paymentMethodOptions,
    helpRequestRefusalReasonOptions,
    isRefundableOptions
  } from '~/client/options/helpRequest'
  import { withEmptyValue } from '~/utils/options'

  const { helpRequestStatusOptions } = useHelpRequestStatus()

  const props = defineProps<{
    status: SocialSupportStatus
    hasSetExternalStructure: boolean
    isExternalSupport: boolean
  }>()

  const { value: subject } = useField<HelpRequestSubject>('subject')

  const isAccepted = computed(
    () => props.status === SocialSupportStatus.Accepted
  )
  const isRefused = computed(() => props.status === SocialSupportStatus.Refused)
  const isAnswered = computed(() => isAccepted.value || isRefused.value)

  const isFinancialSupport = computed(
    () => subject.value === HelpRequestSubject.Financial
  )

  const headline = computed(() => {
    switch (subject.value) {
      case HelpRequestSubject.Financial:
        return "Informations sur l'aide financière"
      default:
        return "Informations sur le dossier d'instruction"
    }
  })
</script>
