<template>
  <li
    :id="`history-${socialSupportId}`"
    ref="$el"
    class="beneficiary-history-details-collapse force-focus-visible"
    :class="[typeClass, expanded ? 'expanded' : '']"
  >
    <BeneficiaryHistoryDetailsHeader
      :social-support="itemData"
      :collapse-id="collapseId"
      :expanded="expanded"
      :single-beneficiary="singleBeneficiary"
      @toggle-expand="expanded = !expanded"
    />
    <BeneficiaryHistoryDetailsBody
      :expanded
      :type="item.socialSupportType"
      :social-support-id="socialSupportId"
      :collapse-id="collapseId"
      :family-file-permissions="familyFilePermissions"
      :rdv-metadata="item.rdvMetadata"
      @deleted="emit('deleted', socialSupportId)"
    />
  </li>
</template>

<script setup lang="ts">
  import type { SocialSupportItem } from './types'
  import type { FamilyFilePermissions } from '~~/server/security'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'

  const route = useRoute()

  const props = defineProps<{
    item: SocialSupportItem
    familyFilePermissions: FamilyFilePermissions
    singleBeneficiary: boolean
  }>()

  const emit = defineEmits<{
    deleted: [socialSupportId: string]
  }>()

  const $el = ref<HTMLLIElement | null>(null)
  const collapseContainer = ref<HTMLDivElement | null>(null)

  const expanded = ref(false)

  const itemData = computed(() => props.item)
  const socialSupportId = computed(() => itemData.value.id)
  const collapseId = computed(() => `collapse-${socialSupportId.value}`)

  const typeClass = computed(() => {
    switch (itemData.value.socialSupportType) {
      case 'Followup':
        return 'followup-details'
      case 'HelpRequest':
        return 'help-request-details'
      case 'Appointment':
        return 'appointment-details'
      default:
        return 'help-request-details'
    }
  })

  onMounted(() => {
    const tab = route.hash.slice(1)
    const { item } = route.query
    if (
      $el.value &&
      tab === BeneficiaryTab.History &&
      item === socialSupportId.value
    ) {
      setTimeout(() => {
        if ($el.value != null) {
          $el.value.scrollIntoView({ block: 'nearest' })
        }
      }, 400)
    }
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

    &.appointment-details {
      .beneficiary-history-details-collapse__title {
        background-color: #fff;
        border-color: var(--rust);
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

      &.appointment-details {
        .beneficiary-history-details-collapse__title {
          border-width: 3px 3px 0;
        }

        .beneficiary-history-details-body {
          background-color: #fff;
          border-color: var(--rust);
          border-style: solid;
          border-width: 0 3px 3px;
        }
      }
    }
  }
</style>
