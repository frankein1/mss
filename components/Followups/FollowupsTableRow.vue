<template>
  <NuxtLink
    v-slot="{ navigate }"
    custom
    :to="followupPath"
  >
    <tr
      class="clickable-row"
      @click="navigate"
    >
      <td>
        <FollowupsTableRowStatusForm
          v-if="canEditHistory"
          :followup="followup"
          @click.stop
        />
        <span
          v-else
          class="fr-badge"
          :class="[followupStatusClasses[followup.status]]"
        >
          {{ followupStatusOptions.get(followup.status) }}
        </span>
      </td>
      <td>
        {{ followupMediumOptions.get(followup.medium) }}
      </td>
      <td>{{ followUpTypes }}</td>
      <td v-if="canAccessRestrictedFieldsInHelpRequest">
        <template v-if="canDisplayDetailedHistory">
          {{ followup.dueDate ? formatDate(followup.dueDate) : undefined }}
        </template>
      </td>
      <td>
        {{ getBeneficiaryDisplayName(followup.beneficiary) }}
      </td>
      <td>
        <template v-if="followup.createdBy">
          {{ getUserDisplayName(followup.createdBy) }}
        </template>
      </td>
      <td>{{ readableFileNumber(followup.beneficiary.id) }}</td>
    </tr>
  </NuxtLink>
</template>

<script lang="ts" setup>
  import { FollowupItem } from './types'
  import { HistoryTab } from '~/utils/constants/history'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary-tabs'
  import {
    followupStatusOptions,
    followupMediumOptions
  } from '~/client/options/followup'
  import { followupStatusClasses } from '~/client/classes/followup'
  import { readableFileNumber } from '~/utils/readableFileNumber'
  import { getUserDisplayName } from '~/utils/user'
  import { formatDate } from '~/utils/formatDate'
  import { canAccessProtectedDataInHelpRequest } from '~/server/query/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { getBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { Routes } from '~/utils/routing/routes'

  const authStore = useAuthStore()
  const user = authStore.getAuthUser
  const route = useRoute()

  const props = defineProps<{
    followup: FollowupItem
  }>()

  const followupPath = computed(() =>
    Routes.Beneficiary(props.followup.beneficiary.id, {
      tab: BeneficiaryTab.History,
      item: props.followup.id,
      originPage: route.path,
      originTab: HistoryTab.Followups
    })
  )

  const followUpTypes = computed(() =>
    props.followup.types.map(({ name }) => name).join(', ')
  )

  const canAccessRestrictedFieldsInHelpRequest = computed(() =>
    canAccessProtectedDataInHelpRequest(user)
  )

  const canDisplayDetailedHistory = computed(
    () => true
    // TODO
    // permissionsStore.canDisplayDetailedHistory({
    //   ...props.history,
    //   isInterview: props.isInterview
    // })
  )

  const canEditHistory = computed(
    () => true
    // TODO
    // permissionsStore.canEditHistoryItem(props.history)
  )
</script>
