<template>
  <div
    class="beneficiary-history-details-collapse__title"
    :class="{ expanded: expanded }"
  >
    <div class="history-details__icon">
      <span :class="attrs.icon"></span>
    </div>
    <div class="history-details__meta">
      <p class="fr-mb-0 fr-text--xs history-details__type-title">
        <AtomPictogram
          v-if="attrs.picto"
          :path="attrs.picto"
          length="2rem"
        />
        {{ attrs.title }}
      </p>
      <h4 class="history-details__title">
        <span class="fr-sr-only">{{ attrs.title }} - </span>
        <template v-if="data.createdBy">
          {{ formatUserDisplayName(data.createdBy) }}
          <span> · </span>
        </template>
        <span class="history-details__date">
          le {{ formatDate(data.date) }}
        </span>
        <template v-if="!singleBeneficiary">
          <span> · </span>
          <span class="fr-text--regular">
            suivi {{ formatBeneficiaryDisplayName(data.beneficiary) }}
          </span>
        </template>
      </h4>
      <div
        v-if="data.lastUpdatedBy"
        class="fr-text--xs fr-mb-1v"
      >
        Mis à jour par {{ formatUserDisplayName(data.lastUpdatedBy) }} le
        {{ formatDate(data.updated) }}
      </div>
      <ul class="fr-tags-group social-support-subjects-tags">
        <template v-if="data.socialSupportType === 'Appointment'">
          <li v-if="data.appointment?.subject">
            <p class="fr-tag">{{ data.appointment.subject }}</p>
          </li>
        </template>
        <template v-else>
          <li
            v-for="socialSupportSubject in data.subjects"
            :key="socialSupportSubject.id"
          >
            <p class="fr-tag">{{ socialSupportSubject.name }}</p>
          </li>
        </template>
      </ul>
    </div>
    <div class="history-details__status">
      <SocialSupportBadgesGroup
        :status="data.status"
        :redirected-label
        :has-unread-notifications
        :first-followup="
          data.followup?.firstFollowup
            ? followupFieldLabels.firstFollowup
            : undefined
        "
      />
      <button
        ref="collapseBtn"
        class="fr-btn collapse-btn fr-btn--tertiary"
        :class="{ expanded: expanded }"
        aria-expanded="false"
        :aria-controls="collapseId"
        :title="attrs.collapseTitle"
        @click="emit('toggleExpand')"
      >
        {{ collapse.label }}
        <span :class="[collapse.icon]"></span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { SocialSupportData } from './types'
  import { fileInstructionTypePictos } from '~/client/options'
  import { formatDate } from '~/utils/formatDate'
  import { formatUserDisplayName } from '~/utils/user'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { followupFieldLabels } from '~/client/labels'

  const route = useRoute()

  const props = withDefaults(
    defineProps<{
      data: SocialSupportData
      collapseId: string
      expanded?: boolean
      hasUnreadNotifications?: boolean
      singleBeneficiary?: boolean
    }>(),
    { expanded: false, hasUnreadNotifications: false, singleBeneficiary: true }
  )

  const emit = defineEmits<{
    toggleExpand: []
  }>()

  const collapseBtn = ref<HTMLButtonElement | null>(null)

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

  const attrs = computed(() => {
    switch (props.data.socialSupportType) {
      case 'Followup':
        return {
          icon: 'fr-icon-followup-fill',
          picto: undefined,
          title: "Synthèse d'entretien",
          collapseTitle: "Voir les détails de la synthèse d'entretien"
        }
      case 'Appointment':
        return {
          icon: 'fr-icon-calendar-event-line',
          picto: undefined,
          title: 'Rendez-vous',
          collapseTitle: 'Voir les détails du rendez-vous'
        }
      case 'HelpRequest': {
        let title: string, picto: string
        if (props.data.fileInstruction?.type === 'Housing') {
          picto = fileInstructionTypePictos.Housing
          title = 'Instruction de dossier - Demande de logement'
        } else if (props.data.fileInstruction?.type === 'Financial') {
          picto = fileInstructionTypePictos.Financial
          title = 'Instruction de dossier - Aide financière'
        } else {
          picto = fileInstructionTypePictos.Other
          title = 'Instruction de dossier - Autre'
        }
        return {
          icon: 'fr-icon-help-request-fill',
          picto,
          title,
          collapseTitle: "Voir les détails de l'instruction de dossier"
        }
      }
      default:
        return { icon: undefined, title: '', collapseTitle: '' }
    }
  })

  const collapse = computed(() => {
    return props.expanded
      ? { label: 'Voir moins', icon: 'fr-icon-arrow-up-s-line' }
      : { label: 'Voir plus', icon: 'fr-icon-arrow-down-s-line' }
  })

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

  .fr-icon-calendar-event-line {
    color: var(--rust);
    background-color: var(--rust-light);
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
