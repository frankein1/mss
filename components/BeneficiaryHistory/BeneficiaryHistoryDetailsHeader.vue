<template>
  <div
    class="beneficiary-history-details-collapse__title"
    :class="{ expanded: expanded }"
  >
    <div class="history-details__icon">
      <span :class="historyTypeIcon"></span>
    </div>
    <div class="history-details__meta">
      <p class="fr-mb-0 fr-text--xs history-details__type-title">
        <AtomPictogram
          v-if="fileInstructionPicto"
          :path="fileInstructionPicto"
          length="2rem"
        />
        {{ historyTypeTitle }}
      </p>
      <h2 class="history-details__title">
        <template v-if="data.createdBy">
          {{ formatUserDisplayName(data.createdBy) }}
          <span> · </span>
        </template>
        <span class="history-details__date"
          >le {{ formatDate(data.date) }}</span
        >
      </h2>
      <ul class="fr-tags-group social-support-subjects-tags">
        <li
          v-for="socialSupportSubject in data.subjects"
          :key="socialSupportSubject.id"
        >
          <p class="fr-tag">{{ socialSupportSubject.name }}</p>
        </li>
      </ul>
    </div>
    <div class="history-details__status">
      <!-- TODO: use SocialSupportBadgesGroup component -->
      <ul class="fr-badges-group status-badges">
        <li>
          <p
            class="fr-badge"
            :class="[socialSupportStatusClasses[props.data.status]]"
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
        <li v-if="data.followup?.firstFollowup">
          <p class="fr-badge fr-badge--info fr-badge--no-icon">
            {{ followupFieldLabels.firstFollowup }}
          </p>
        </li>
      </ul>
      <button
        ref="collapseBtn"
        class="fr-btn collapse-btn fr-btn--tertiary"
        :class="{ expanded: expanded }"
        aria-expanded="false"
        :aria-controls="collapseId"
        :title="collapseBtnTitle"
        @click="emit('toggleExpand')"
      >
        {{ collapseBtnLabel }}
        <span :class="[collapseBtnIcon]"></span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { SocialSupportData } from './types'
  import { socialSupportStatusClasses } from '~/client/classes/socialSupport'
  import { fileInstructionTypePictos } from '~/client/options'
  import { formatDate } from '~/utils/formatDate'
  import { formatUserDisplayName } from '~/utils/user'
  import { followupFieldLabels } from '~/client/labels'

  const route = useRoute()
  const { socialSupportStatusKeys } = useSocialSupportStatus()

  const props = withDefaults(
    defineProps<{
      data: SocialSupportData
      collapseId: string
      expanded?: boolean
      hasUnreadNotifications?: boolean
    }>(),
    { expanded: false, hasUnreadNotifications: false }
  )

  const emit = defineEmits<{
    toggleExpand: []
  }>()

  const isFollowup = computed(() => props.data.socialSupportType === 'Followup')

  const collapseBtn = ref<HTMLButtonElement | null>(null)

  const statusLabel = computed(() =>
    socialSupportStatusKeys.value.value(props.data.status)
  )

  const redirectedLabel = computed(() => {
    const followup = props.data.followup
    if (!followup) {
      return ''
    }
    if (followup.redirected) {
      const label = 'Réorienté'
      return followup.structureName
        ? `${label} : ${followup.structureName}`
        : label
    }
  })

  const historyTypeIcon = computed(() =>
    isFollowup.value ? 'fr-icon-followup-fill' : 'fr-icon-help-request-fill'
  )

  const fileInstructionPicto = computed(() => {
    if (!props.data.fileInstruction) {
      return undefined
    }
    const { type } = props.data.fileInstruction
    if (type === 'Financial') {
      return fileInstructionTypePictos.Financial
    }

    if (type === 'Other') {
      return fileInstructionTypePictos.Other
    }

    if (type === 'Housing') {
      return fileInstructionTypePictos.Housing
    }
  })

  const historyTypeTitle = computed(() => {
    if (isFollowup.value) {
      return "Synthèse d'entretien"
    }

    const fileInstruction = props.data.fileInstruction

    const helpRequestTitle = 'Instruction de dossier'

    if (fileInstruction?.type === 'Housing') {
      return `${helpRequestTitle} - Demande de logement`
    }

    if (fileInstruction?.type === 'Financial') {
      return `${helpRequestTitle} - Aide financière`
    }

    return `${helpRequestTitle} - Autre`
  })

  const historyTypeLabel = computed(() =>
    isFollowup.value ? "la synthèse d'entretien" : "l'instruction de dossier"
  )

  const collapseBtnTitle = computed(
    () => `Voir les détails de ${historyTypeLabel.value}`
  )

  const collapseBtnLabel = computed(() =>
    props.expanded ? 'Voir moins' : 'Voir plus'
  )

  const collapseBtnIcon = computed(() =>
    props.expanded ? 'fr-icon-arrow-up-s-line' : 'fr-icon-arrow-down-s-line'
  )

  onMounted(() => {
    // Expand item if selected in URL
    const { item } = route.query
    if (item === props.data.id && collapseBtn.value) {
      collapseBtn.value.click()
      collapseBtn.value.ariaExpanded = 'true'
    }
  })
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/core/index' as dsfr;

  .history-details__icon {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      padding: 1rem;
      border-radius: 100%;
    }
  }

  .fr-icon-followup-fill {
    color: var(--color-followup);
    background-color: var(--color-followup-light);
  }

  .fr-icon-help-request-fill {
    color: var(--color-help-request);
    background-color: var(--color-help-request-light);
  }

  .history-details__meta {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    .fr-tags-group {
      margin-top: 0.6rem;
    }
  }

  .history-details__type-title > svg {
    vertical-align: text-bottom;
  }

  .beneficiary-history-details-collapse__title {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    padding: 1.5rem;
    column-gap: 1.5rem;
    border-radius: 0.5rem;

    &.expanded {
      border-radius: 0.5rem 0.5rem 0 0;
    }
  }

  .history-details__title {
    @include dsfr.text-style(lg);

    --title-spacing: 0;
  }

  .history-details__date {
    font-weight: 400;
  }

  .history-details__status {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
  }

  .status-badges {
    justify-content: flex-end;
  }

  .social-support-subjects-tags {
    margin-bottom: -0.8rem;
  }

  .collapse-btn {
    box-shadow: none;
    outline-width: 0;
    text-wrap: nowrap;

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
      border-radius: 0.5rem;
    }

    &.expanded::before {
      border-radius: 0.5rem 0.5rem 0 0;
    }
  }
</style>
