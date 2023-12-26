<template>
  <section>
    <BeneficiaryHistoryComment
      v-for="comment in comments"
      :key="comment.id"
      class="fr-mb-1w"
      :comment="comment"
      @comment-edited="emit('commentEdited', $event)"
      @comment-deleted="emit('commentDeleted', $event)"
    />
    <BeneficiaryHistoryCommentAdd
      v-if="canAddComments"
      :class="{ 'fr-mt-1w': comments.length }"
      :history="history"
      @comment-added="emit('commentAdded', $event)"
    />
  </section>
</template>

<script setup lang="ts">
  import { HistoryItem, HistoryItemComment, HistoryItemComments } from './types'
  import { canAddComment as canAddCommentsRule } from '~/server/security'

  const props = defineProps<{
    comments: HistoryItemComments
    history: HistoryItem
  }>()

  const emit = defineEmits<{
    commentAdded: [comment: HistoryItemComment]
    commentEdited: [comment: HistoryItemComment]
    commentDeleted: [comment: HistoryItemComment]
  }>()

  const canAddComments = computed(() =>
    useSecurityRule().canWithTarget(
      canAddCommentsRule,
      props.history.beneficiary
    )
  )
</script>
