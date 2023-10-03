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
        :title="`Voir ${document.name} - Ouvre une nouvelle fenêtre`"
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

  const onView = (key: string) => {
    if (process.client) {
      useTrpcMutation({
        mutation: () =>
          useTrpcClient().documents.createViewUrl.mutate({
            key
          }),
        onSuccess: ({ url }) => {
          window.open(url, '_blank')?.focus()
        },
        onFailure: () => {
          useSnackbar().error('Le chargement du document a échoué.')
        }
      })
    }
  }
</script>
