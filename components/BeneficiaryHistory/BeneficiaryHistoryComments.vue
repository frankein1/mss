<template>
  <section>
    <BeneficiaryHistoryComment
      v-for="item in items"
      :key="item.comment.id"
      class="fr-mb-1w"
      :item="item"
      @comment-edited="emit('commentEdited', $event)"
      @comment-deleted="emit('commentDeleted', $event)"
    />
    <BeneficiaryHistoryCommentAdd
      v-if="beneficiaryPermissions.create.document"
      :class="{ 'fr-mt-1w': items.length }"
      :social-support="socialSupport"
      @comment-added="emit('commentAdded', $event)"
    />
  </section>
</template>

<script setup lang="ts">
  import {
    SocialSupportData,
    CommentData,
    CommentItem,
    CommentItems
  } from '~/server/trpc/routers'
  import { BeneficiaryPermissions } from '~/server/security'

  defineProps<{
    items: CommentItems
    socialSupport: SocialSupportData
    beneficiaryPermissions: BeneficiaryPermissions
  }>()

  const emit = defineEmits<{
    commentAdded: [comment: CommentItem]
    commentEdited: [comment: CommentData]
    commentDeleted: [comment: CommentData]
  }>()
</script>
