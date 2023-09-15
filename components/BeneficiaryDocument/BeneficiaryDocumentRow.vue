<template>
  <tr>
    <td>{{ documentTypeLabels[document.type] }}</td>
    <td>
      <div class="name-container">
        {{ document.name }}
        <span
          v-if="document.confidential"
          class="fr-badge fr-badge--warning fr-ml-1w"
          >CONFIDENTIEL</span
        >
        <span
          v-if="hasUnreadNotifications"
          class="fr-badge fr-badge--new fr-badge--no-icon fr-ml-1w"
        >
          <span class="fr-icon-notification-3-fill fr-icon--sm fr-mr-1v"></span>
          NOUVEAU
        </span>
      </div>
    </td>
    <td>{{ formatDate(document.created) }}</td>
    <td>
      <span
        v-if="document.tags.length"
        class="fr-tag"
        >{{ documentTagLabels[document.tags[0] as DocumentTag] }}</span
      >
      <span
        v-if="document.tags.length > 1"
        class="fr-tag fr-ml-1w"
        >+{{ document.tags.length - 1 }}</span
      >
    </td>
  </tr>
</template>

<script lang="ts" setup>
  import { DocumentItem } from './types'
  import { DocumentTag } from '~/types/document'
  import {
    documentTypeLabels,
    documentTagLabels
  } from '~/client/options/document'

  const props = defineProps<{
    document: DocumentItem
  }>()

  const hasUnreadNotifications = computed(
    () => !!props.document._count.Notification
  )
</script>

<style scoped>
  .name-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
</style>
