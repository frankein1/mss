<template>
  <li
    :id="`history-${socialSupportId}`"
    ref="$el"
    class="beneficiary-history-details-collapse force-focus-visible"
    :class="[typeClass, expanded ? 'expanded' : '']"
  >
    <BeneficiaryHistoryDetailsHeader
      :data="itemData"
      :collapse-id="collapseId"
      :expanded="expanded"
      :has-unread-notifications="hasUnreadNotifications"
      @toggle-expand="expanded = !expanded"
    />
    <BeneficiaryHistoryDetailsBody
      :item="item"
      :collapse-id="collapseId"
      :beneficiary-permissions="beneficiaryPermissions"
      @deleted="emit('deleted', socialSupportId)"
    />
  </li>
</template>

<script setup lang="ts">
  import type { SocialSupportItem } from '~/server/trpc/routers'
  import { BeneficiaryPermissions } from '~/server/security'

  const props = defineProps<{
    item: SocialSupportItem
    beneficiaryPermissions: BeneficiaryPermissions
  }>()

  const emit = defineEmits<{
    deleted: [socialSupportId: string]
  }>()

  const $el = ref<HTMLLIElement | null>(null)
  const collapseContainer = ref<HTMLDivElement | null>(null)

  const expanded = ref(false)

  const itemData = computed(() => props.item.data)
  const socialSupportId = computed(() => itemData.value.id)
  const collapseId = computed(() => `collapse-${socialSupportId.value}`)

  const typeClass = computed(() =>
    itemData.value.socialSupportType === 'Followup'
      ? 'followup-details'
      : 'help-request-details'
  )

  const hasUnreadNotifications = computed(
    () => !!itemData.value.hasUnreadNotifications
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
