<template>
  <div class="fr-container">
    <div class="fr-grid-column">
      <div class="fr-col-12">
        <PrintFollowupHeader
          title="Entretien"
          :beneficiary-firstname="followup.beneficiary.firstName"
          :beneficiary-usualname="followup.beneficiary.usualName"
          :date="followup.date ? formatDate(followup.date, 'DD/MM/YYYY') : null"
          :status="followup.status"
        />
      </div>
      <div class="fr-col-12">
        <ul>
          <PrintDetailItem
            :title="followupFieldLabels.firstFollowup"
            :content="followup.firstFollowup ? 'OUI' : null"
          />
          <PrintDetailItem
            :title="followupFieldLabels.duration"
            :content="followupDurationKeys.value(followup.duration)"
          />

          <PrintDetailItem
            :title="followupFieldLabels.numeroPegase"
            :content="followup.numeroPegase"
          />
          <PrintDetailItem
            :title="followupFieldLabels.ministre"
            :content="followup.ministre"
          />
          <PrintDetailItem
            :title="followupFieldLabels.medium"
            :content="followupMediumKeys.value(followup.medium)"
          />

          <PrintDetailItem
            :title="followupFieldLabels.thirdPersonName"
            :content="followup.thirdPersonName"
          />
          <PrintDetailItem
            :title="FollowupMedium.ExternalAppointment"
            :content="
              followup.medium === FollowupMedium.ExternalAppointment
                ? 'OUI'
                : null
            "
          />
          <PrintDetailItem
            :title="followupFieldLabels.subjects"
            :content="followup.subjects.map(({ name }) => name).join(', ')"
          />
          <PrintDetailItem
            :title="followupFieldLabels.prescribingOrganizationId"
            :content="followup.prescribingOrganization?.name"
          />
          <PrintDetailItem
            :title="followupFieldLabels.prescribingOrganizationContactId"
            :content="followup.prescribingOrganizationContact?.name"
          />
          <PrintDetailItem
            :title="followupFieldLabels.dueDate"
            :content="followup.dueDate ? formatDate(followup.date) : null"
          />
          <template v-if="followup.synthesisRichText || followup.synthesis">
            <li class="details">
              <span class="fr-text--bold"
                >{{ followupFieldLabels.synthesis }}&nbsp;:</span
              >
            </li>
            <AtomTextEditorReader
              :value="followup.synthesisRichText"
              :raw-text="followup.synthesis"
              @vue:mounted="onUpdated"
            />
          </template>

          <li v-if="followup.redirected || followup.helpRequested">
            <span class="fr-text--bold">Actions entreprises&nbsp;:</span>
            <ul>
              <li v-if="followup.redirected">
                Réorienté après l'entretien<span v-if="followup.structureName"
                  >&nbsp;: {{ followup.structureName }}</span
                >
              </li>
              <li v-if="followup.helpRequested">
                {{ followupFieldLabels.helpRequested }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { FollowupMedium } from '@prisma/client'
  import { FollowupOutput } from './types'
  import { formatDate } from '~/utils/formatDate'
  import { followupFieldLabels } from '~/client/labels'
  import { followupMediumKeys, followupDurationKeys } from '~/client/options'

  defineProps<{
    followup: FollowupOutput
  }>()
  const emit = defineEmits<{
    onUpdated: []
  }>()
  const onUpdated = () => {
    emit('onUpdated')
  }
</script>
