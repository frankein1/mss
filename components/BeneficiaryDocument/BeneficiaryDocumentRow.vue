<template>
  <tr>
    <td>{{ documentTypeLabels[document.type] }}</td>
    <td>{{ document.name }}</td>
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

  defineProps<{
    document: DocumentItem
  }>()
</script>
