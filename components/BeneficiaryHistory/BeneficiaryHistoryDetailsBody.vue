<template>
  <div
    :id="accordionId"
    class="fr-collapse beneficiary-history-details-body"
  >
    <template v-if="canViewHistoryDetails">
      <BeneficiaryFollowupDetailsBodyMetas
        v-if="history.isFollowup"
        :followup="history"
      />
      <BeneficiaryHelpRequestDetailsBodyMetas
        v-else
        :help-request="history"
      />

      <!-- TODO: Add documents to history items -->
      <!-- <BeneficiaryHistoryDetailsBodyDocuments
        v-if="history.documents?.length"
        :documents="history.documents"
      /> -->

      <template v-if="history.synthesis">
        <h3 class="synthesis-title">Compte rendu</h3>
        <p class="synthesis-content">{{ history.synthesis }}</p>
      </template>

      <template v-if="canViewPrivateSynthesis && history.privateSynthesis">
        <h3 class="synthesis-title fr-icon-lock-line">Compte rendu privé</h3>
        <p class="synthesis-content">{{ history.privateSynthesis }}</p>
      </template>

      <ul
        class="fr-btns-group fr-btns-group--sm fr-btns-group--inline fr-btns-group--right"
      >
        <li v-if="canDelete">
          <button
            class="fr-btn fr-btn--secondary btn-delete"
            data-fr-opened="false"
            aria-controls="global-modal"
            type="button"
            @click="onDelete"
          >
            Supprimer
          </button>
        </li>
        <li v-if="canEdit">
          <NuxtLink
            :to="editLink"
            class="fr-btn fr-btn--secondary"
            target="_self"
          >
            Modifier
          </NuxtLink>
        </li>
      </ul>

      <hr
        v-if="canListComments"
        class="fr-pb-3v"
      />
    </template>

    <BeneficiaryHistoryComments
      v-if="canListComments"
      :comments="comments"
      :history="history"
      @comment-added="onCommentAdded"
    />
  </div>
</template>

<script setup lang="ts">
  import type { HistoryItem, HistoryItemComment } from './types'
  import BeneficiaryHistoryDeleteForm from './BeneficiaryHistoryDeleteForm.vue'
  import { RoutePath } from '~/utils/routing'
  import {
    canEditFollowup,
    canEditHelpRequest,
    canDeleteFollowup,
    canDeleteHelpRequest,
    canViewHelpRequestDetails,
    canViewFollowupDetails,
    canViewFollowupPrivateSynthesis,
    canListCommentsToFollowup,
    canListCommentsToHelpRequest
  } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'

  const { getAuthUser: user } = useAuthStore()

  const props = defineProps<{
    history: HistoryItem
    accordionId: string
  }>()

  const emit = defineEmits<{
    (e: 'deleted'): void
  }>()

  const comments = ref(props.history.comments || [])

  const editLink = computed(() => {
    const routeWithParams = props.history.isFollowup
      ? RoutePath.BeneficiaryFollowupEdit
      : RoutePath.BeneficiaryHelpRequestEdit
    return routeWithParams(props.history.beneficiaryId, props.history.id)
  })

  const canEditRule = computed(() =>
    props.history.isFollowup ? canEditFollowup : canEditHelpRequest
  )

  const canEdit = computed(() => canEditRule.value(user, props.history))

  const canDeleteRule = computed(() =>
    props.history.isFollowup ? canDeleteFollowup : canDeleteHelpRequest
  )

  const canDelete = computed(() => canDeleteRule.value(user, props.history))

  const canViewHistoryDetails = computed(() =>
    props.history.isFollowup
      ? canViewFollowupDetails(user, props.history)
      : canViewHelpRequestDetails(user, props.history.beneficiary)
  )

  const canViewPrivateSynthesis = computed(
    () =>
      props.history.isFollowup
        ? canViewFollowupPrivateSynthesis(user, props.history)
        : true // FIXME: Add the rule for the private synthesis of help requests
  )

  const canListCommentsRule = computed(() =>
    props.history.isFollowup
      ? canListCommentsToFollowup
      : canListCommentsToHelpRequest
  )

  const canListComments = computed(() =>
    canListCommentsRule.value(user, props.history.beneficiary)
  )

  function onCommentAdded(comment: HistoryItemComment) {
    comments.value.push(comment)
  }

  function onDelete() {
    useModal().open(
      props.history.isFollowup
        ? "Supprimer la synthèse d'entretien"
        : "Supprimer l'instruction de demande d'aide",
      BeneficiaryHistoryDeleteForm,
      {
        historyItemId: props.history.id,
        isFollowup: props.history.isFollowup
      },
      { deleted: onHistoryItemDeleted }
    )
  }

  function onHistoryItemDeleted() {
    emit('deleted')
    useSnackbar().success("L'accompagnement a été supprimé.")
  }
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/core/index' as dsfr;

  .beneficiary-history-details-body {
    --text-spacing: 0 0 1rem;

    border-radius: 0 0 0.5rem 0.5rem;

    &.fr-collapse--expanded {
      padding: 2rem 1.5rem 1rem;
    }
  }

  .synthesis-title {
    @include dsfr.text-style(md);

    margin-bottom: 0.5rem;

    &::before {
      margin-right: 0.25rem;
    }
  }

  .synthesis-content {
    white-space: pre-line;
  }

  .btn-delete {
    box-shadow: inset 0 0 0 1px var(--red-marianne-main-472);
    color: var(--red-marianne-main-472);
  }
</style>

<style>
  .beneficiary-history-details-body .information-label {
    color: var(--text-title-grey);
    font-weight: 700;
  }
</style>
