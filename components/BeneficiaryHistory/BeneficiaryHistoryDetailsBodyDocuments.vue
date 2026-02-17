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
  const { legacyBlob } = useDownload()

  const onView = async (key: string, migrated: boolean) => {
    const data = await $fetch<Blob>(`/api/document/download?key=${key}`)
    legacyBlob.open(data)
  }
</script>
