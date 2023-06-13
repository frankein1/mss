<template>
  <div
    :id="accordionId"
    class="fr-collapse beneficiary-history-details-body"
  >
    <template v-if="displayDetailedHistory">
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

      <template v-if="history.privateSynthesis">
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

      <hr class="fr-pb-3v" />
    </template>

    <BeneficiaryHistoryComments
      :comments="comments"
      :history="history"
      @comment-added="onCommentAdded"
    />
  </div>
</template>

<script setup lang="ts">
  import type { HistoryItem, HistoryItemComment } from './types'
  import BeneficiaryHistoryDeleteForm from './BeneficiaryHistoryDeleteForm.vue'
  import { Routes } from '~/utils/routing/routes'
  import {
    canEditBeneficiaryFollowup,
    canEditBeneficiaryHelpRequest,
    canDeleteBeneficiaryFollowup,
    canDeleteBeneficiaryHelpRequest,
    canAccessProtectedDataInHelpRequest
  } from '~/server/query/security/rules'
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
      ? Routes.BeneficiaryFollowupEdit
      : Routes.BeneficiaryHelpRequestEdit
    return routeWithParams(props.history.beneficiaryId, props.history.id)
  })

  const canEditRule = computed(() =>
    props.history.isFollowup
      ? canEditBeneficiaryFollowup
      : canEditBeneficiaryHelpRequest
  )

  const canEdit = computed(() =>
    canEditRule.value(user, props.history.beneficiary, props.history)
  )

  const canDeleteRule = computed(() =>
    props.history.isFollowup
      ? canDeleteBeneficiaryFollowup
      : canDeleteBeneficiaryHelpRequest
  )

  const canDelete = computed(() =>
    canDeleteRule.value(user, props.history.beneficiary, props.history)
  )

  const displayDetailedHistory = computed(
    () => props.history.isFollowup || canAccessProtectedDataInHelpRequest(user)
    // FIXME: Does it correspond to permissionsStore.canDisplayDetailedHistory(props.history) ?
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
