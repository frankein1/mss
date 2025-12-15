<template>
  <p>
    <span class="information-label">Documents : </span>
    <span
      v-for="({ document, permissions }, index) in documents"
      :key="document.key"
    >
      <button
        v-if="permissions.view"
        class="fr-link"
        :title="`Voir ${document.name} - nouvelle fenêtre`"
        @click="onView(document.key, document.migrated)"
      >
        {{ document.name }}</button
      ><template v-else>{{ document.name }} (confidentiel)</template
      ><template v-if="index != documents.length - 1">, </template>
    </span>
  </p>
</template>

<script lang="ts" setup>
  import type { DocumentItems } from './types'

  defineProps<{
    documents: DocumentItems
  }>()

  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const { legacyBlob, open } = useDownload()

  const onView = async (key: string, migrated: boolean) => {
    // If document has not been migrated, fetch document from DB
    if (!migrated) {
      const data = await $fetch<Blob>(`/api/document/download?key=${key}`)
      legacyBlob.open(data)

      return
    }

    // Else, fetch document from S3
    const { data, status } = await trpcClient.documents.getSignedUrl.useQuery({
      key
    })

    if (!data.value || status.value === 'error') {
      snackbar.error('Le chargement du document a échoué.')
      return
    }

    open(data.value)
  }
</script>
