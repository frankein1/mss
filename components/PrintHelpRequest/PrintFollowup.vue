<template>
  <div class="fr-container">
    <div class="fr-grid-column">
      <div class="fr-col-12">
        <PrintFollowupHeader
          title="Entretien"
          :beneficiary="followup.beneficiary"
          :created-by="followup.createdBy"
          :last-updated-by="followup.lastUpdatedBy"
          :date="followup.date ? formatDate(followup.date, 'DD/MM/YYYY') : null"
          :updated="
            followup.updated ? formatDate(followup.updated, 'DD/MM/YYYY') : null
          "
          :status="followup.status"
        />
      </div>
      <div class="fr-col-12">
        <ul>
          <PrintDetailItem
            :title="followupFieldLabels.firstFollowup"
            :content="followup.firstFollowup ? 'OUI' : null"
          />
          <!-- <PrintDetailItem
            :title="followupFieldLabels.endOfSocialSupport"
            :content="followup.endOfSocialSupport ? 'OUI' : null"
          /> -->
          <PrintDetailItem
            :title="followupFieldLabels.isDuringWalkInSession"
            :content="followup.isDuringWalkInSession ? 'OUI' : null"
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
            :title="followupFieldLabels.minister"
            :content="ministerName"
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
              @on-create="$emit('onCreate')"
            />
          </template>

          <li v-if="followup.helpRequested">
            <span class="fr-text--bold">Actions entreprises&nbsp;:</span>
            <ul>
              <li>
                {{ followupFieldLabels.helpRequested }}
              </li>
            </ul>
          </li>
        </ul>
        <template v-if="followup.socialSupportRedirections?.length">
          <hr class="fr-mt-4w" />
          <ul>
            <li
              v-for="redirection in followup.socialSupportRedirections"
              :key="redirection.id"
            >
              <span class="fr-text--bold">Réorientation&nbsp;:</span>
              {{ socialSupportRedirectionTypeKeys.value(redirection.type) }}
              <ul>
                <li v-if="redirection.partnerOrganization?.name">
                  <span class="fr-text--bold"
                    >{{
                      socialSupportRedirectionLabels.partnerOrganizationId
                    }}&nbsp;:</span
                  >
                  {{ redirection.partnerOrganization.name }}
                </li>
                <li v-if="redirection.partnerOrganizationContact?.name">
                  <span class="fr-text--bold"
                    >{{
                      socialSupportRedirectionLabels.partnerOrganizationContactId
                    }}&nbsp;:</span
                  >
                  {{ redirection.partnerOrganizationContact.name }}
                </li>
                <li v-if="redirection.externalStructureName">
                  <span class="fr-text--bold"
                    >{{
                      socialSupportRedirectionLabels.externalStructureName
                    }}&nbsp;:</span
                  >
                  {{ redirection.externalStructureName }}
                </li>
              </ul>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { FollowupMedium } from '@prisma/client'
  import type { FollowupOutput } from './types'
  import { formatDate } from '~/utils/formatDate'
  import { followupFieldLabels } from '~/client/labels'
  import { socialSupportRedirectionLabels } from '~/client/labels/redirection.labels'
  import { followupMediumKeys, followupDurationKeys } from '~/client/options'
  import { socialSupportRedirectionTypeKeys } from '~/client/options/redirection'
  import { formatMinisterName } from '~/utils/minister'

  const props = defineProps<{
    followup: FollowupOutput
  }>()
  defineEmits<{ onCreate: [] }>()

  const ministerName = computed(() => {
    if (!props.followup.minister) {
      return null
    }
    return formatMinisterName(props.followup.minister)
  })
</script>
