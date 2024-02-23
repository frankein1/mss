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
      v-else-if="ongoingCountsWithLabel.length"
      class="ongoing-social-supports__list"
    >
      <li
        v-for="{ label, count } in ongoingCountsWithLabel"
        :key="label"
      >
        <!-- TODO: Link -->
        <NuxtLink
          :to="RoutePath.AppHistory(tab)"
          class="fr-link fr-icon-arrow-right-line fr-link--icon-left"
        >
          {{ label }} ({{ count }})
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
  import { socialSupportStatusLabels } from '~/client/options/socialSupport'
  import { AlertType } from '~/utils/constants/alert'
  import { HistoryTab } from '~/utils/constants/history'

  const props = defineProps<{
    isFileInstructions: boolean
    title: string
    ongoingSocialSupports: Array<{
      status: SocialSupportStatus
      _count: number
    }> | null
    emptyMessage: string
    pending: boolean
    errorMessage: string
  }>()

  const ongoingCountsWithLabel = computed(() => {
    if (!props.ongoingSocialSupports?.length) {
      return []
    }

    return props.ongoingSocialSupports.reduce(
      (oss, { status, _count: count }) => [
        ...oss,
        { label: socialSupportStatusLabels[status], count }
      ],
      [] as Array<{ label: string; count: number }>
    )
  })

  const tab = computed(() =>
    props.isFileInstructions
      ? HistoryTab.FileInstructions
      : HistoryTab.Followups
  )
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
