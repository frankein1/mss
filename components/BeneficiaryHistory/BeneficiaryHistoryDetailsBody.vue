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
          :housing-help-request="
            socialSupport.fileInstruction.housingHelpRequest
          "
          :status="socialSupport.status"
        />
      </ul>

      <BeneficiaryHistoryDetailsBodyDocuments
        v-if="socialSupport.documents?.length"
        :documents="socialSupport.documents"
      />

      <template v-if="socialSupport.synthesis">
        <h3 class="synthesis-title">Compte rendu</h3>
        <p class="synthesis-content">{{ socialSupport.synthesis }}</p>
      </template>

      <template v-if="socialSupport.privateSynthesis">
        <h3 class="synthesis-title fr-icon-lock-line">Compte rendu privé</h3>
        <p class="synthesis-content">{{ socialSupport.privateSynthesis }}</p>
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
        <li v-if="printLink">
          <NuxtLink
            :to="printLink"
            class="fr-btn fr-btn--secondary fr-icon-printer-line"
            @on-click="onPrint"
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
  </div>
</template>

<script setup lang="ts">
  import { FileInstructionType } from '@prisma/client'
  import BeneficiaryHistoryDeleteForm from './BeneficiaryHistoryDeleteForm.vue'
  import type { SocialSupportItem, CommentData, CommentItem } from './types'
  import { FamilyFilePermissions } from '~/server/security'
  import { DocumentEventAction, EventCategory } from '~/types/matomo'
  import { TypeSuivi } from '~/client/options'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    item: SocialSupportItem
    collapseId: string
    familyFilePermissions: FamilyFilePermissions
  }>()

  const emit = defineEmits<{
    deleted: []
  }>()

  const socialSupport = computed(() => props.item.data)
  const permissions = computed(() => props.item.permissions)

  const isFollowup = computed(
    () => socialSupport.value.socialSupportType === 'Followup'
  )

  const commentItems = ref(socialSupport.value.comments || [])

  const printLink = computed(() => {
    if (socialSupport.value.followup) {
      return routes.file.AppHistoryPrint.path(
        socialSupport.value.followup.id,
        TypeSuivi.Followup
      )
    }
    const helpRequest = socialSupport.value.fileInstruction?.helpRequest
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
    if (socialSupport.value.followup) {
      return routes.followup.AppBeneficiaryFollowupEdit.path(
        socialSupport.value.familyFileId,
        socialSupport.value.followup.id
      )
    }
    const helpRequest = socialSupport.value.fileInstruction?.helpRequest
    if (helpRequest) {
      const subject = helpRequest.financialSupport
        ? FileInstructionType.Financial
        : FileInstructionType.Other
      return routes.helpRequest.AppBeneficiaryHelpRequestEdit.path(
        socialSupport.value.beneficiaryId,
        helpRequest.id,
        subject
      )
    }

    const housingHelpRequest =
      socialSupport.value.fileInstruction?.housingHelpRequest
    if (housingHelpRequest) {
      return routes.helpRequest.AppBeneficiaryHelpRequestEdit.path(
        socialSupport.value.beneficiaryId,
        housingHelpRequest.id,
        FileInstructionType.Housing
      )
    }

    return null
  })

  const canEdit = computed(() => permissions.value?.edit)

  const canDelete = computed(() => permissions.value?.delete)

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

  function onPrint() {
    useMatomo().trackEvent(EventCategory.Document, DocumentEventAction.Print)
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

  .information-list {
    column-gap: 2rem;
    margin-bottom: 0.5rem;
    column-count: 2;
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
