<template>
  <div
    :id="collapseId"
    class="fr-collapse beneficiary-history-details-body"
  >
    <hr
      v-if="canViewHistoryDetails"
      class="fr-mb-1v"
    />

    <template v-if="canViewHistoryDetails">
      <BeneficiaryFollowupDetailsBodyMetas
        v-if="historyData.isFollowup"
        :followup="historyData as FollowupHistoryItem"
      />
      <BeneficiaryHelpRequestDetailsBodyMetas
        v-else
        :help-request="historyData"
      />

      <BeneficiaryHistoryDetailsBodyDocuments
        v-if="historyData.documents?.length"
        :documents="historyData.documents"
      />

      <template v-if="historyData.synthesis">
        <h3 class="synthesis-title">Compte rendu</h3>
        <p class="synthesis-content">{{ historyData.synthesis }}</p>
      </template>

      <template v-if="canViewPrivateSynthesis && historyData.privateSynthesis">
        <h3 class="synthesis-title fr-icon-lock-line">Compte rendu privé</h3>
        <p class="synthesis-content">{{ historyData.privateSynthesis }}</p>
      </template>

      <ul
        class="fr-btns-group fr-btns-group--sm fr-btns-group--icon-left fr-btns-group--inline fr-btns-group--right"
      >
        <li v-if="canDelete">
          <button
            class="fr-btn fr-btn--secondary btn-delete fr-icon-delete-line"
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
            class="fr-btn fr-btn--secondary fr-icon-edit-line"
          >
            Modifier
          </NuxtLink>
        </li>
      </ul>

      <hr
        v-if="comments.length > 0"
        class="fr-pb-3v"
      />
    </template>

    <BeneficiaryHistoryComments
      :comments="comments"
      :history="historyData"
      @comment-added="onCommentAdded"
      @comment-edited="onCommentEdited"
      @comment-deleted="onCommentDeleted"
    />
  </div>
</template>

<script setup lang="ts">
  import type {
    HistoryItem,
    HistoryItemComment,
    FollowupHistoryItem
  } from './types'
  import BeneficiaryHistoryDeleteForm from './BeneficiaryHistoryDeleteForm.vue'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    history: HistoryItem
    collapseId: string
  }>()

  const emit = defineEmits<{
    deleted: []
  }>()

  const historyData = computed(() => props.history.data)
  const permissions = computed(() => props.history.permissions)

  const comments = ref(historyData.value.comments || [])

  const editLink = computed(() => {
    const routeWithParams = historyData.value.isFollowup
      ? RoutePath.AppBeneficiaryFollowupEdit
      : RoutePath.AppBeneficiaryHelpRequestEdit
    return routeWithParams(
      historyData.value.beneficiaryId,
      historyData.value.id
    )
  })

  const canEdit = computed(() => permissions.value?.edit)

  const canDelete = computed(() => permissions.value?.delete)

  const canViewHistoryDetails = computed(() => permissions.value?.get.details)

  const canViewPrivateSynthesis = computed(
    () => permissions.value?.get.privateSynthesis
  )

  function onCommentAdded(comment: HistoryItemComment) {
    comments.value.push(comment)
  }

  function onCommentEdited(editedComment: HistoryItemComment) {
    comments.value = comments.value.map(comment =>
      comment.id === editedComment.id ? editedComment : comment
    )
  }

  function onCommentDeleted(deletedComment: HistoryItemComment) {
    comments.value = comments.value.filter(
      comment => comment.id !== deletedComment.id
    )
  }

  function onDelete() {
    useModal().open({
      title: historyData.value.isFollowup
        ? "Supprimer la synthèse d'entretien"
        : "Supprimer l'instruction de dossier",
      contentComponent: BeneficiaryHistoryDeleteForm,
      contentComponentProps: {
        historyItemId: historyData.value.id,
        isFollowup: historyData.value.isFollowup
      },
      contentComponentEvents: { deleted: onHistoryItemDeleted }
    })
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
      padding: 0.5rem 1.5rem 1rem;
    }
  }

  .synthesis-title {
    @include dsfr.text-style(md);

    margin-bottom: 0.5rem;
    color: var(--text-mention-grey);
    font-weight: 400;

    &::before {
      margin-right: 0.25rem;
    }
  }

  .synthesis-content {
    white-space: pre-line;
    font-weight: 500;
  }

  .btn-delete {
    box-shadow: inset 0 0 0 1px var(--red-marianne-main-472);
    color: var(--red-marianne-main-472);
  }
</style>

<style>
  .beneficiary-history-details-body .information-label {
    color: var(--text-mention-grey);
    font-weight: 400;
  }

  .beneficiary-history-details-body li {
    font-weight: 500;
  }
</style>
