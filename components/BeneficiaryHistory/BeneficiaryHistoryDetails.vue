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
  .beneficiary-history-details-accordion {
    border-radius: 0.5rem;

    &.followup-details {
      .beneficiary-history-details-accordion__title {
        background-color: #fff;
        border-color: var(--color-followup);
        border-style: solid;
        border-width: 1px;
      }

      &.expanded {
        .beneficiary-history-details-accordion__title {
          border-width: 3px 3px 0;
        }

        .beneficiary-history-details-body {
          background-color: #fff;
          border-color: var(--color-followup);
          border-style: solid;
          border-width: 0 3px 3px;
        }
      }
    }

    &.help-request-details {
      .beneficiary-history-details-accordion__title {
        background-color: #fff;
        border-color: var(--color-help-request);
        border-style: solid;
        border-width: 1px;
      }

      &.expanded {
        .beneficiary-history-details-accordion__title {
          border-width: 3px 3px 0;
        }

        .beneficiary-history-details-body {
          background-color: #fff;
          border-color: var(--color-help-request);
          border-style: solid;
          border-width: 0 3px 3px;
        }
      }
    }
  }
</style>
