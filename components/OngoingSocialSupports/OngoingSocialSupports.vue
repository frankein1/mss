<template>
  <div
    class="feature-section ongoing-social-supports"
    :class="[
      isHelpRequests
        ? 'ongoing-social-supports__help-requests'
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
    <ul
      v-if="ongoingSocialSupports.length"
      class="ongoing-social-supports__list"
    >
      <li
        v-for="ongoingSocialSupport in ongoingSocialSupports"
        :key="ongoingSocialSupport.label"
      >
        <NuxtLink
          :to="RoutePath.AppHistory()"
          class="fr-link fr-icon-arrow-right-line fr-link--icon-left"
          >{{ ongoingSocialSupport.label }} ({{
            ongoingSocialSupport.count
          }})</NuxtLink
        >
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
  import { RoutePath } from '~/utils/routing'

  defineProps<{
    isHelpRequests: boolean
    title: string
    ongoingSocialSupports: Array<{
      label: string
      count: number
    }>
    emptyMessage: string
  }>()
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

  .ongoing-social-supports__help-requests {
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
  }

  .ongoing-social-supports__empty {
    --text-spacing: 0;

    text-align: center;
  }
</style>
