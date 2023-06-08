<template>
  <section>
    <BeneficiaryHistoryComment
      v-for="comment in comments"
      :key="comment.id"
      class="fr-mb-1w"
      :comment="comment"
    />
    <BeneficiaryHistoryCommentAdd
      :class="{ 'fr-mt-1w': comments.length }"
      :history="history"
      @comment-added="emit('commentAdded', $event)"
    />
  </section>
</template>

<script setup lang="ts">
  import { HistoryItem, HistoryItemComment, HistoryItemComments } from './types'

  defineProps<{
    comments: HistoryItemComments
    history: HistoryItem
  }>()

  const emit = defineEmits<{
    (e: 'commentAdded', comment: HistoryItemComment): void
  }>()
</script>
