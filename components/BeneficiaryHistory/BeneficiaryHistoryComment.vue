<template>
  <div>
    <div class="comment-meta">
      <h4>
        <template v-if="comment.updated">Modifié</template
        ><template v-else>Ajouté</template> le {{ commentDate }} par
        {{ authorName }}
      </h4>
      <button
        v-if="!isEditing && permissions.edit"
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
  import { CommentItem, CommentData } from './types'
  import { formatDate } from '~/utils/formatDate'
  import { formatUserDisplayName } from '~/utils/user'

  const props = defineProps<{
    item: CommentItem
  }>()

  const emit = defineEmits<{
    commentEdited: [comment: CommentData]
    commentDeleted: [comment: CommentData]
  }>()

  const comment = computed(() => props.item.comment)
  const permissions = computed(() => props.item.permissions)

  const isEditing = ref(false)

  const commentDate = computed(() =>
    formatDate(comment.value.updated ?? comment.value.created)
  )

  const authorName = computed(() =>
    formatUserDisplayName(comment.value.createdBy)
  )
</script>

<style lang="scss">
  @use '@gouvfr/dsfr/src/core/index' as dsfr;

  .comment-meta {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.5rem;

    h4,
    button {
      color: var(--text-mention-grey);
      margin-bottom: 0.25rem;
      font-weight: 400;

      @include dsfr.text-style(sm);
    }

    button {
      box-shadow: none;
    }
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
