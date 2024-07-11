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
    <li v-if="redirectedLabel">
      <p class="fr-badge fr-badge--purple-glycine">
        {{ redirectedLabel }}
      </p>
    </li>
    <li v-if="hasUnreadNotifications">
      <p class="fr-badge fr-badge--new fr-badge--no-icon">
        <span class="fr-icon-notification-3-fill fr-icon--sm"></span>
      </p>
    </li>
    <li v-if="firstFollowup">
      <p class="fr-badge fr-badge--info fr-badge--no-icon">
        {{ firstFollowup }}
      </p>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { SocialSupportStatus } from '@prisma/client'
  import { socialSupportStatusClasses } from '~/client/classes/socialSupport'

  const props = defineProps<{
    status: SocialSupportStatus
    hasUnreadNotifications?: boolean
    redirectedLabel?: string
    firstFollowup?: string
  }>()

  const { socialSupportStatusKeys } = useSocialSupportStatus()

  const statusLabel = computed(() =>
    socialSupportStatusKeys.value.value(props.status)
  )
</script>
