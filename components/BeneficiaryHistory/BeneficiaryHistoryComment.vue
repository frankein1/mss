<template>
  <div>
    <div class="comment-meta">
      <h4>
        <template v-if="comment.updated">Modifié</template
        ><template v-else>Ajouté</template> le {{ commentDate }} par
        {{ authorName }}
      </h4>
      <button
        v-if="!isEditing && canEditComment"
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-btn--sm fr-icon-pencil-line"
        @click="isEditing = true"
      >
        Modifier
      </button>
    </div>
    <div class="comment-body">
      <BeneficiaryHistoryCommentUserInitials
        class="fr-mr-1v"
        :user="comment.createdBy"
      />
      <BeneficiaryHistoryCommentEdit
        v-if="isEditing"
        :comment="comment"
        @cancel="isEditing = false"
        @comment-edited="emit('commentEdited', $event)"
        @comment-deleted="emit('commentDeleted', $event)"
      />
      <div
        v-else
        class="comment-content"
      >
        {{ comment.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { HistoryItemComment } from './types'
  import { canEditComment as canEditCommentRule } from '~/server/security/rules/comment'
  import { formatDate } from '~/utils/formatDate'
  import { formatUserDisplayName } from '~/utils/user'

  const props = defineProps<{
    comment: HistoryItemComment
  }>()

  const emit = defineEmits<{
    commentEdited: [comment: HistoryItemComment]
    commentDeleted: [comment: HistoryItemComment]
  }>()

  const isEditing = ref(false)

  const user = useAuth()

  const canEditComment = computed(() =>
    canEditCommentRule(user.value, props.comment)
  )

  const commentDate = computed(() =>
    formatDate(props.comment.updated ?? props.comment.created)
  )

  const authorName = computed(() =>
    formatUserDisplayName(props.comment.createdBy)
  )
</script>

<style lang="scss">
  @use '@gouvfr/dsfr/src/core/index' as dsfr;

  .comment-meta {
    h4,
    button {
      @include dsfr.text-style(sm);

      color: var(--text-mention-grey);
      margin-bottom: 0.25rem;
      font-weight: 400;
    }

    button {
      box-shadow: none;
    }

    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.5rem;
  }

  .comment-body {
    display: flex;
  }

  .comment-content {
    padding: 0.5rem 0.75rem;
    border-radius: 0 0.5rem 0.5rem;
    background-color: var(--background-contrast-grey);
    word-break: break-word;
  }
</style>
