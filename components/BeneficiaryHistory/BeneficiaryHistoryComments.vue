<template>
  <section>
    <BeneficiaryHistoryComment
      v-for="comment in comments"
      :key="comment.id"
      class="fr-mb-1w"
      :comment="comment"
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
  import { useAuthStore } from '~/store/auth'
  import {
    canAddCommentToFollowup,
    canAddCommentToHelpRequest
  } from '~/server/security/rules'

  const authStore = useAuthStore()

  const props = defineProps<{
    comments: HistoryItemComments
    history: HistoryItem
  }>()

  const emit = defineEmits<{
    commentAdded: [comment: HistoryItemComment]
  }>()

  const canAddCommentsRule = computed(() =>
    props.history.isFollowup
      ? canAddCommentToFollowup
      : canAddCommentToHelpRequest
  )

  const canAddComments = computed(() =>
    canAddCommentsRule.value(authStore.getAuthUser, props.history.beneficiary)
  )
</script>
