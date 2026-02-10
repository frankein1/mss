<template>
  <hr
    v-if="canViewHistoryDetails"
    class="fr-mb-1v"
  />

  <template v-if="canViewHistoryDetails">
    <div class="header">
      <div
        v-if="socialSupport.lastUpdatedBy"
        class="fr-text--xs fr-mb-1v"
      >
        Mis à jour par
        {{ formatUserDisplayName(socialSupport.lastUpdatedBy) }} le
        {{ formatDate(socialSupport.updated) }}
      </div>
      <div class="spacer"></div>
      <ul class="fr-badges-group">
        <li v-if="redirectedLabel">
          <p class="fr-badge fr-badge--purple-glycine">
            {{ redirectedLabel }}
          </p>
        </li>
        <li v-if="socialSupport.followup?.firstFollowup">
          <p class="fr-badge fr-badge--info fr-badge--no-icon">
            {{ followupFieldLabels.firstFollowup }}
          </p>
        </li>
      </ul>
    </div>
    <ul class="information-list">
      <BeneficiarySocialSupportDetailsBodyMetas
        :social-support="socialSupport"
      />
      <BeneficiaryFollowupDetailsBodyMetas
        v-if="socialSupport.followup"
        :followup="socialSupport.followup"
      />
      <BeneficiaryHelpRequestDetailsBodyMetas
        v-else-if="socialSupport.fileInstruction?.helpRequest"
        :file-instruction="socialSupport.fileInstruction"
        :help-request="socialSupport.fileInstruction.helpRequest"
        :status="socialSupport.status"
      />
      <BeneficiaryHousingHelpRequestDetailsBodyMetas
        v-else-if="socialSupport.fileInstruction?.housingHelpRequest"
        :file-instruction="socialSupport.fileInstruction"
        :housing-help-request="socialSupport.fileInstruction.housingHelpRequest"
        :status="socialSupport.status"
      />
    </ul>

    <BeneficiaryHistoryDetailsBodyDocuments
      v-if="socialSupport.documents?.length"
      :documents="socialSupport.documents"
    />

    <template v-if="socialSupport.synthesis">
      <h3 class="synthesis-title">Compte rendu</h3>
      <AtomTextEditorReader
        :value="socialSupport.synthesisRichText"
        :raw-text="socialSupport.synthesis"
      />
    </template>

    <template v-if="socialSupport.privateSynthesis">
      <h3 class="synthesis-title fr-icon-lock-line">Compte rendu privé</h3>
      <AtomTextEditorReader
        :value="socialSupport.privateSynthesisRichText"
        :raw-text="socialSupport.privateSynthesis"
      />
    </template>

    <ul
      class="fr-btns-group fr-btns-group--sm fr-btns-group--inline fr-btns-group--icon-left fr-btns-group--left"
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
      <li v-if="canPrint && printLink">
        <NuxtLink
          :to="printLink"
          class="fr-btn fr-btn--secondary fr-icon-printer-line"
        >
          Imprimer
        </NuxtLink>
      </li>
      <li v-if="canEdit && editLink">
        <NuxtLink
          :to="editLink"
          class="fr-btn fr-btn--secondary fr-icon-edit-line"
        >
          Modifier
        </NuxtLink>
      </li>
    </ul>

    <hr
      v-if="familyFilePermissions.create.document || commentItems.length > 0"
      class="fr-pb-3v"
    />
  </template>

  <BeneficiaryHistoryComments
    :items="commentItems"
    :social-support="socialSupport"
    :family-file-permissions="familyFilePermissions"
    @comment-added="onCommentAdded"
    @comment-edited="onCommentEdited"
    @comment-deleted="onCommentDeleted"
  />
</template>

<script setup lang="ts">
  import { FileInstructionType } from '~/prisma/generated/browser'
  import BeneficiaryHistoryDeleteForm from './BeneficiaryHistoryDeleteForm.vue'
  import type {
    CommentData,
    CommentItem,
    SocialSupportDetailItem
  } from './types'
  import type { FamilyFilePermissions } from '~/server/security'
  import { TypeSuivi } from '~/client/options'
  import { routes } from '~/utils/routes'
  import { formatUserDisplayName } from '~/utils/user'
  import { followupFieldLabels } from '~/client/labels'

  const props = defineProps<{
    item: SocialSupportDetailItem
    familyFilePermissions: FamilyFilePermissions
  }>()

  const emit = defineEmits<{
    deleted: []
  }>()

  const socialSupport = computed(() => props.item.data)

  const permissions = computed(() => props.item.permissions)

  const isFollowup = computed(
    () => socialSupport.value?.socialSupportType === 'Followup'
  )

  const commentItems = ref(socialSupport.value?.comments || [])

  const redirectedLabel = computed(() => {
    const followup = socialSupport.value?.followup
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

  const printLink = computed(() => {
    if (socialSupport.value?.followup) {
      return routes.file.AppHistoryPrint.path(
        socialSupport.value?.followup.id,
        TypeSuivi.Followup
      )
    }
    const helpRequest = socialSupport.value?.fileInstruction?.helpRequest
    if (helpRequest?.id) {
      return routes.file.AppHistoryPrint.path(
        helpRequest.id,
        TypeSuivi.AllHelpRequest
      )
    }

    if (socialSupport.value.fileInstruction?.housingHelpRequest) {
      return routes.file.AppHistoryPrint.path(
        socialSupport.value.fileInstruction?.housingHelpRequest.id,
        TypeSuivi.HousingHelpRequest
      )
    }
    return null
  })

  const editLink = computed(() => {
    if (socialSupport.value?.followup) {
      return routes.followup.AppBeneficiaryFollowupEdit.path(
        socialSupport.value?.familyFileId,
        socialSupport.value?.followup.id
      )
    }
    const helpRequest = socialSupport.value.fileInstruction?.helpRequest
    if (helpRequest) {
      const subject = helpRequest.financialSupport
        ? FileInstructionType.Financial
        : FileInstructionType.Other
      return routes.helpRequest.AppBeneficiaryHelpRequestEdit.path(
        socialSupport.value?.familyFileId,
        helpRequest.id,
        subject
      )
    }

    const housingHelpRequest =
      socialSupport.value.fileInstruction?.housingHelpRequest
    if (housingHelpRequest) {
      return routes.helpRequest.AppBeneficiaryHelpRequestEdit.path(
        socialSupport.value?.familyFileId,
        housingHelpRequest.id,
        FileInstructionType.Housing
      )
    }

    return null
  })

  const canEdit = computed(() => permissions.value?.edit)

  const canDelete = computed(() => permissions.value?.delete)

  const canPrint = computed(() => permissions.value?.print)

  const canViewHistoryDetails = computed(() => permissions.value?.get.details)

  function onDelete() {
    useModal().open(BeneficiaryHistoryDeleteForm, {
      title: isFollowup.value
        ? "Supprimer la synthèse d'entretien"
        : "Supprimer l'instruction de dossier",
      socialSupportId: socialSupport.value.id,
      isFollowup: isFollowup.value,
      deleted: onSocialSupportItemDeleted
    })
  }

  function onCommentAdded(commentItem: CommentItem) {
    commentItems.value.push(commentItem)
  }

  function onCommentEdited(editedComment: CommentData) {
    commentItems.value = commentItems.value.map(commentItem =>
      commentItem.comment.id === editedComment.id
        ? { comment: editedComment, permissions: commentItem.permissions }
        : commentItem
    )
  }

  function onCommentDeleted(deletedComment: CommentData) {
    commentItems.value = commentItems.value.filter(
      ({ comment }) => comment.id !== deletedComment.id
    )
  }

  function onSocialSupportItemDeleted() {
    emit('deleted')
    useSnackbar().success("L'accompagnement a été supprimé.")
  }
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/dsfr/core/index' as dsfr;
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .beneficiary-history-details-body {
    --text-spacing: 0 0 1rem;

    border-radius: 0 0 0.5rem 0.5rem;

    &.fr-collapse--expanded {
      padding: 0.5rem 1.5rem 1rem;
    }
  }

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .spacer {
    flex: 1;
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

  .information-list {
    margin-bottom: 0.5rem;

    @include dsfr-media-query.respond-from('md') {
      column-gap: 2rem;
      column-count: 2;
    }
  }

  .fr-btns-group--left {
    @include dsfr-media-query.respond-from('md') {
      text-align: right;
      justify-content: flex-end;
    }
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
