<template>
  <p>
    <span class="information-label">Documents :</span>
    <span
      v-for="(document, index) in documents"
      :key="document.key"
    >
      <button
        class="fr-link"
        target="_blank"
        :title="'Nouvel onglet - Voir ' + document.name"
        @click="onView(document.key)"
      >
        {{ document.name }}</button
      ><template v-if="index != documents.length - 1">, </template>
    </span>
  </p>
</template>

<script lang="ts" setup>
  import { HistoryItemDocuments } from './types'

  defineProps<{
    documents: HistoryItemDocuments
  }>()

  const onView = async (key: string) => {
    if (process.client) {
      const { url } = await useTrpcClient().documents.createViewUrl.mutate({
        key
      })
      window.open(url, '_blank')?.focus()
    }
  }
</script>
