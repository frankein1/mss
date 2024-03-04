<template>
  <div
    class="feature-section ongoing-social-supports"
    :class="[
      isFileInstructions
        ? 'ongoing-social-supports__file-instructions'
        : 'ongoing-social-supports__followups'
    ]"
  >
    <div class="ongoing-social-supports__header">
      <span
        class="ongoing-social-supports__icon fr-icon-questionnaire-line"
        aria-hidden="true"
      ></span>
      <h2 class="ongoing-social-supports__title">{{ title }}</h2>
    </div>
    <AtomAlert
      v-if="errorMessage"
      class="fr-mx-auto"
      :alert-type="AlertType.Error"
      :message="errorMessage"
    />
    <AtomLoader
      v-else-if="pending"
      class="fr-mx-auto"
    />
    <ul
      v-else-if="ongoingSocialSupports?.length"
      class="ongoing-social-supports__list"
    >
      <li
        v-for="{ status, _count } in ongoingSocialSupports"
        :key="status"
      >
        <NuxtLink
          :to="RoutePath.AppHistory(tab)"
          class="fr-link fr-icon-arrow-right-line fr-link--icon-left"
          @click="onNavigate(status)"
        >
          {{ socialSupportStatusLabels[status] }} ({{ _count }})
        </NuxtLink>
      </li>
    </ul>
    <p
      v-else
      class="ongoing-social-supports__empty"
    >
      {{ emptyMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import { SocialSupportStatus } from '@prisma/client'
  import { RoutePath } from '~/utils/routing'
  import { AlertType } from '~/utils/constants/alert'
  import { HistoryTab } from '~/utils/constants/history'
  import { EventCategory, OverviewToHistoryEventAction } from '~/types/matomo'

  type OngoingSocialSupportStatus = Exclude<
    SocialSupportStatus,
    | 'Accepted'
    | 'Refused'
    | 'Adjourned'
    | 'ClosedByBeneficiary'
    | 'ClosedByAgent'
    | 'Dismissed'
    | 'Done'
  >

  const filtersState = useFilters()
  const { socialSupportStatusLabels } = useSocialSupportStatus()
  const authState = useAuthState()

  const props = defineProps<{
    isFileInstructions: boolean
    title: string
    ongoingSocialSupports: Array<{
      status: OngoingSocialSupportStatus
      _count: number
    }> | null
    emptyMessage: string
    pending: boolean
    errorMessage: string
  }>()

  const tab = computed(() =>
    props.isFileInstructions
      ? HistoryTab.FileInstructions
      : HistoryTab.Followups
  )

  function onNavigate(status: OngoingSocialSupportStatus) {
    useMatomo().trackEvent(
      EventCategory.OverviewToHistory,
      OverviewToHistoryEventAction[status]
    )

    if (props.isFileInstructions) {
      filtersState.fileInstruction.value = {
        status,
        createdById: authState.getUserId.value
          ? [authState.getUserId.value]
          : undefined
      }
    } else {
      filtersState.followup.value = {
        status,
        createdById: authState.getUserId.value
          ? [authState.getUserId.value]
          : undefined
      }
    }
  }
</script>

<style lang="scss">
  $section-padding: 1.5rem;

  .ongoing-social-supports {
    padding: $section-padding;
  }

  .ongoing-social-supports__header {
    margin: -#{$section-padding} -#{$section-padding} 0;
    padding: $section-padding $section-padding 1rem;
    position: relative;
    margin-bottom: 2rem;

    .ongoing-social-supports__icon {
      padding: 1.25rem;
      border-radius: 50%;
      border-width: 2px;
      background-color: var(--text-inverted-grey);
      border-style: solid;
      position: absolute;
      margin-top: -0.5rem;
    }

    .ongoing-social-supports__title {
      --title-spacing: 0;

      font-size: 1.25rem;
      line-height: 2rem;
      font-weight: 700;
      margin-top: 0.25rem;
      margin-left: 5.5rem;
    }
  }

  .ongoing-social-supports__file-instructions {
    .ongoing-social-supports__header {
      background-color: var(--background-alt-purple-glycine);
    }

    .ongoing-social-supports__icon {
      border-color: var(--border-default-purple-glycine);
      color: var(--border-default-purple-glycine);
    }

    .ongoing-social-supports__title {
      color: var(--border-default-purple-glycine);
    }
  }

  .ongoing-social-supports__followups {
    .ongoing-social-supports__header {
      background-color: var(--background-alt-green-archipel);
    }

    .ongoing-social-supports__icon {
      border-color: var(--border-plain-green-archipel);
      color: var(--border-plain-green-archipel);
    }

    .ongoing-social-supports__title {
      color: var(--border-plain-green-archipel);
    }
  }

  .ongoing-social-supports__list {
    --ul-type: none;
    --ul-start: 0;
    --xl-block: 0;
    --li-bottom: 1.25rem;

    > :last-child {
      --li-bottom: 0;
    }
  }

  .ongoing-social-supports__empty {
    --text-spacing: 0;

    text-align: center;
  }
</style>
