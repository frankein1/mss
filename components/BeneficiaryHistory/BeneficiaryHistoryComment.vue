<template>
  <div>
    <h4 class="comment-meta">
      Ajouté le {{ createdDate }} par {{ authorName }}
    </h4>
    <div class="comment-body">
      <BeneficiaryHistoryCommentUserInitials
        class="fr-mr-1v"
        :user="comment.createdBy"
      />
      <div class="comment-content">
        {{ comment.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { HistoryItemComment } from './types'
  import { formatDate } from '~/utils/formatDate'
  import { getUserDisplayName } from '~/utils/user'

  const props = defineProps<{
    comment: HistoryItemComment
  }>()

  const createdDate = computed(() => formatDate(props.comment.created))

  const authorName = computed(() => getUserDisplayName(props.comment.createdBy))
</script>

<style lang="scss">
  @use '@gouvfr/dsfr/src/core/index' as dsfr;

  .comment-meta {
    @include dsfr.text-style(sm);

    color: var(--text-mention-grey);
    margin-bottom: 0.25rem;
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
