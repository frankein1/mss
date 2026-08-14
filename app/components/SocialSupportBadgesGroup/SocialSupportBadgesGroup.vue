<template>
  <ul class="fr-badges-group">
    <li>
      <p
        class="fr-badge"
        :class="[socialSupportStatusClasses[status]]"
      >
        {{ statusLabel }}
      </p>
    </li>
    <li v-if="hasUnreadNotifications">
      <p class="fr-badge fr-badge--new fr-badge--no-icon">
        <span class="fr-icon-notification-3-fill fr-icon--sm"></span>
      </p>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import type { SocialSupportStatus } from '@prisma/client'
  import { socialSupportStatusClasses } from '~~/client/classes/socialSupport'
  import { appointmentStatusKeys } from '~~/client/options'

  const props = defineProps<{
    status: SocialSupportStatus | 'RdvUpcoming' | 'RdvObsolete'
    hasUnreadNotifications?: boolean
    isAppointment?: boolean
  }>()

  const { socialSupportStatusKeys } = useSocialSupportStatus()

  const statusLabel = computed(() =>
    props.isAppointment
      ? appointmentStatusKeys.value(props.status)
      : socialSupportStatusKeys.value.value(props.status)
  )
</script>
