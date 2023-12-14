<template>
  <li
    :id="`history-${historyId}`"
    ref="$el"
    class="beneficiary-history-details-collapse force-focus-visible"
    :class="[typeClass, expanded ? 'expanded' : '']"
    tabindex="0"
  >
    <BeneficiaryHistoryDetailsHeader
      :history="history"
      :collapse-id="collapseId"
      :expanded="expanded"
      :has-unread-notifications="hasUnreadNotifications"
      @toggle-expand="expanded = !expanded"
    />
    <BeneficiaryHistoryDetailsBody
      :history="history"
      :collapse-id="collapseId"
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

  const $el = ref<HTMLLIElement | null>(null)
  const collapseContainer = ref<HTMLDivElement | null>(null)

  const expanded = ref(false)

  const historyId = computed(() => props.history.id)
  const collapseId = computed(() => `collapse-${historyId.value}`)

  const typeClass = computed(() =>
    props.history.isFollowup ? 'followup-details' : 'help-request-details'
  )

  const hasUnreadNotifications = computed(
    () => !!props.history.hasUnreadNotifications
  )

  onMounted(() => {
    collapseContainer.value =
      $el.value?.querySelector<HTMLDivElement>(`#${collapseId.value}`) || null

    // Listen to DSFR conceal as the DSFR script closes collapse on tab change.
    if (collapseContainer.value) {
      collapseContainer.value.addEventListener('dsfr.conceal', onDsfrConceal)
    }
  })

  onUnmounted(() => {
    if (collapseContainer.value) {
      collapseContainer.value.removeEventListener('dsfr.conceal', onDsfrConceal)
    }
  })

  function onDsfrConceal() {
    expanded.value = false
  }
</script>

<style lang="scss" scoped>
  .beneficiary-history-details-collapse {
    border-radius: 0.5rem;

    &.followup-details {
      .beneficiary-history-details-collapse__title {
        background-color: #fff;
        border-color: var(--color-followup);
        border-style: solid;
        border-width: 1px;
      }
    }

    &.help-request-details {
      .beneficiary-history-details-collapse__title {
        background-color: #fff;
        border-color: var(--color-help-request);
        border-style: solid;
        border-width: 1px;
      }
    }

    &.expanded {
      &.followup-details {
        .beneficiary-history-details-collapse__title {
          border-width: 3px 3px 0;
        }

        .beneficiary-history-details-body {
          background-color: #fff;
          border-color: var(--color-followup);
          border-style: solid;
          border-width: 0 3px 3px;
        }
      }

      &.help-request-details {
        .beneficiary-history-details-collapse__title {
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
