<template>
  <li><span class="information-label">Type :</span> {{ medium }}</li>
  <li v-if="followup.prescribingOrganization?.name">
    <span class="information-label"
      >{{ followupFieldLabels.prescribingOrganizationId }} :</span
    >
    {{ followup.prescribingOrganization.name }}
  </li>
  <li
    v-if="followup.firstFollowup"
    class="fr-icon-success-line"
  >
    {{ followupFieldLabels.firstFollowup }}
  </li>
  <li v-if="followup.duration">
    <span class="information-label">{{ followupFieldLabels.duration }} :</span>
    {{ followupDurationLabels[followup.duration] }}
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
  <!-- <li v-if="interventions">
        <span class="information-label">Interventions :</span>
        {{ interventions }}
      </li>
      <li v-if="signalements">
        <span class="information-label">Signalements :</span>
        {{ signalements }}
      </li> -->
</template>

<script setup lang="ts">
  import { FollowupMedium } from '@prisma/client'
  import { FollowupData } from './types'
  import {
    // followupInterventionLabels,
    followupMediumLabels,
    // followupSignalementLabels,
    followupDurationLabels
  } from '~/client/options'
  import { followupFieldLabels } from '~/client/labels'

  const props = defineProps<{
    followup: FollowupData
  }>()

  const medium = computed(() => {
    const label = followupMediumLabels[props.followup.medium]
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

  // const interventions = computed(() =>
  //   props.followup.interventions
  //     .map(i => followupInterventionLabels[i])
  //     .join(', ')
  // )

  // const signalements = computed(() =>
  //   props.followup.signalements
  //     .map(s => followupSignalementLabels[s])
  //     .join(', ')
  // )
</script>
