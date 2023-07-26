<template>
  <div class="beneficiary-history-details-accordion__title">
    <div class="meta">
      <h2 class="date">
        {{ formatDate(date) }}
      </h2>
      <div
        v-if="history.createdBy"
        class="agent-name"
      >
        {{ getUserDisplayName(history.createdBy) }}
      </div>
      <div
        class="additional-meta"
        :class="{
          'fr-icon-success-fill': history.isFollowup
            ? history.firstFollowup
            : history.fullFile
        }"
      >
        <template v-if="!history.isFollowup && history.fullFile"
          >Dossier complet</template
        >
        <template v-else-if="history.isFollowup && history.firstFollowup">
          1<sup>er</sup> entretien
        </template>
      </div>
      <ul class="fr-badges-group status-badges">
        <li>
          <p
            class="fr-badge"
            :class="[statusClass]"
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
      </ul>
    </div>
    <hr class="divider" />
    <ul class="fr-badges-group follow-up-types-badges">
      <li
        v-for="followUpType in followUpTypes"
        :key="followUpType.id"
      >
        <p class="fr-badge">{{ followUpType.name }}</p>
      </li>
    </ul>
    <button
      class="fr-btn collapse-btn fr-btn--tertiary"
      aria-expanded="false"
      :aria-controls="accordionId"
      :title="collapseBtnLabel"
      @click="emit('toggleExpand')"
    >
      <span :class="[collapseBtnIcon]"></span>
      <span>{{ collapseBtnLabel }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
  import type { HistoryItem } from './types'
  import { followupStatusLabels } from '~/client/options/followup'
  import { followupStatusClasses } from '~/client/classes/followup'
  import { helpRequestStatusClasses } from '~/client/classes/helpRequest'
  import { formatDate } from '~/utils/formatDate'
  import { getUserDisplayName } from '~/utils/user'

  const { helpRequestStatusLabels } = useHelpRequestStatus()

  const props = withDefaults(
    defineProps<{
      history: HistoryItem
      accordionId: string
      expanded?: boolean
      hasUnreadNotifications?: boolean
    }>(),
    { expanded: false, hasUnreadNotifications: false }
  )

  const emit = defineEmits<{
    toggleExpand: []
  }>()

  const date = computed(() =>
    props.history.isFollowup ? props.history.date : props.history.openingDate
  )

  const statusLabel = computed(() => {
    if (props.history.isFollowup) {
      return followupStatusLabels[props.history.status]
    }
    return helpRequestStatusLabels.value[props.history.status]
  })

  const statusClass = computed(() => {
    if (props.history.isFollowup) {
      return followupStatusClasses[props.history.status]
    }
    return helpRequestStatusClasses[props.history.status]
  })

  const redirectedLabel = computed(() => {
    if (props.history.isFollowup) {
      if (props.history.redirected) {
        const label = 'Réorienté'
        return props.history.structureName
          ? `${label} : ${props.history.structureName}`
          : label
      }
    }
    return ''
  })

  const followUpTypes = computed(() => {
    if (props.history.isFollowup) {
      return props.history.types
    }
    return [props.history.type]
  })

  const historyTypeLabel = computed(() =>
    props.history.isFollowup
      ? "la synthèse d'entretien"
      : "l'instruction de demande d'aide"
  )

  const collapseBtnLabel = computed(
    () => `Voir les détails de ${historyTypeLabel.value}`
  )

  const collapseBtnIcon = computed(() =>
    props.expanded ? 'fr-icon-subtract-line' : 'fr-icon-add-line'
  )
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/core/index' as dsfr;

  .beneficiary-history-details-accordion__title {
    position: relative;
    display: grid;
    padding: 1rem;
    column-gap: 0.5rem;
    border-radius: 0.5rem 0.5rem 0 0;
    grid-template-areas:
      'meta accordion-btn'
      'divider accordion-btn'
      'follow-up-types-badges accordion-btn';
    color: #fff;
    grid-template-columns: auto max-content;
  }

  .meta {
    grid-area: meta;
    display: grid;
    column-gap: 1rem;
    grid-template-areas: 'agent-name date additional-meta status-badges';
    grid-template-columns: max-content max-content max-content auto;
    align-items: center;
  }

  .date {
    @include dsfr.text-style(md);

    --title-spacing: 0;

    grid-area: date;
    color: #fff;
  }

  .agent-name {
    grid-area: agent-name;
    font-weight: 700;

    /**
     * The resulted design is quite ugly but it seems browsers leaves the
     * container to the max width once text is wrapped instead of shrinking it
     * to the last text character.
     * See https://stackoverflow.com/a/12377883/7916042
     */
    max-width: 10rem;
  }

  .additional-meta {
    grid-area: additional-meta;

    &::before {
      margin-right: 0.25rem;
    }
  }

  .status-badges {
    grid-area: status-badges;
    justify-self: end;
    justify-content: end;
  }

  .divider {
    --text-spacing: 0 0 0.5rem;

    grid-area: divider;
  }

  .follow-up-types-badges {
    grid-area: follow-up-types-badges;
    margin-bottom: -0.5rem;
  }

  .collapse-btn {
    color: #fff;
    grid-area: accordion-btn;
    box-shadow: none;
    align-self: center;
    outline-width: 0;

    span:nth-child(2) {
      display: none;
    }

    &:hover,
    &:active {
      color: var(--text-default-grey);
    }

    &::before {
      content: '';
      display: block;
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      outline-offset: 2px;
      outline-style: inherit;
      outline-color: inherit;
      outline-width: 2px;
      border-radius: 0.5rem 0.5rem 0 0;
    }
  }
</style>
