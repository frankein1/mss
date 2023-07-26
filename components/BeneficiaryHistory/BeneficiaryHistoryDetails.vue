<template>
  <li
    :id="`history-${historyId}`"
    class="beneficiary-history-details-accordion force-focus-visible"
    :class="[typeClass, expanded ? 'expanded' : '']"
    tabindex="0"
  >
    <BeneficiaryHistoryDetailsHeader
      :history="history"
      :accordion-id="accordionId"
      :expanded="expanded"
      :has-unread-notifications="hasUnreadNotifications"
      @toggle-expand="expanded = !expanded"
    />
    <BeneficiaryHistoryDetailsBody
      :history="history"
      :accordion-id="accordionId"
      @deleted="emit('deleted')"
    />
  </li>
</template>

<script setup lang="ts">
  import type { HistoryItem } from './types'

  const props = defineProps<{
    history: HistoryItem
  }>()

  const emit = defineEmits<{
    deleted: []
  }>()

  const expanded = ref(false)

  const historyId = computed(() => props.history.id)
  const accordionId = computed(() => `accordion-${historyId.value}`)

  const typeClass = computed(() =>
    props.history.isFollowup ? 'followup-details' : 'help-request-details'
  )

  const hasUnreadNotifications = computed(
    () => !!props.history._count.Notification
  )
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

  .beneficiary-history-details-accordion {
    box-shadow: $shadow-dark;
    border-radius: 0.5rem;

    &:not(.expanded) {
      border-radius: 0.5rem 0.5rem 0 0;
    }

    &.followup-details {
      .beneficiary-history-details-accordion__title {
        background-color: var(--color-followup);
        border: 1px solid var(--color-followup);
      }

      &.expanded .beneficiary-history-details-body {
        border: 1px solid var(--color-followup);
      }
    }

    &.help-request-details {
      .beneficiary-history-details-accordion__title {
        border: 1px solid var(--color-help-request);
        background-color: var(--color-help-request);
      }

      &.expanded .beneficiary-history-details-body {
        border: 1px solid var(--color-help-request);
      }
    }
  }
</style>
