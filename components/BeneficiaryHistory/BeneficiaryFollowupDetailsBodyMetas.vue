<template>
  <li><span class="information-label">Type :</span> {{ medium }}</li>
  <li v-if="followup.prescribingOrganization?.name">
    <span class="information-label"
      >{{ followupFieldLabels.prescribingOrganizationId }} :</span
    >
    {{ followup.prescribingOrganization.name }}
  </li>
  <li v-if="followup.duration">
    <span class="information-label">{{ followupFieldLabels.duration }} :</span>
    {{ followupDurationKeys.value(followup.duration) }}
  </li>
  <li
    v-if="followup.helpRequested"
    class="fr-icon-success-line"
  >
    {{ followupFieldLabels.helpRequested }}
  </li>
  <li
    v-if="followup.classified"
    class="fr-icon-success-line"
  >
    Classé
  </li>
  <li
    v-if="followup.forwardedToJustice"
    class="fr-icon-success-line"
  >
    {{ followupFieldLabels.forwardedToJustice }}
  </li>
</template>

<script setup lang="ts">
  import { FollowupMedium } from '@prisma/client'
  import { FollowupData } from './types'
  import { followupMediumKeys, followupDurationKeys } from '~/client/options'
  import { followupFieldLabels } from '~/client/labels'

  const props = defineProps<{
    followup: FollowupData
  }>()

  const medium = computed(() => {
    const label = followupMediumKeys.value(props.followup.medium)
    if (
      (props.followup.medium !== FollowupMedium.ExternalAppointment ||
        !props.followup.place) &&
      (props.followup.medium !== FollowupMedium.ThirdParty ||
        !props.followup.thirdPersonName)
    ) {
      return label
    }
    return `${label} - ${
      props.followup.place || props.followup.thirdPersonName
    }`
  })
</script>
