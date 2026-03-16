<template>
  <p class="fr-h6 fr-mb-0 fr-mt-4v">Documents</p>
  <p
    v-for="({ document, permissions }, index) in documents"
    :key="document.key"
  >
    <!-- TODO a11y a buton shouldn't look like a link -->
    <button
      v-if="permissions.view"
      class="fr-link"
      :title="`Voir ${document.name} - nouvelle fenêtre`"
      @click="onView(document.key)"
    >
      {{ document.name }}</button
    ><template v-else>{{ document.name }} (confidentiel)</template
    ><template v-if="index != documents.length - 1">, </template>
  </p>
</template>

<script lang="ts" setup>
  import type { DocumentItems } from './types'

  defineProps<{
    documents: DocumentItems
  }>()

  const { open } = useDownload()

  const onView = async (key: string) => {
    const data = await $fetch<Blob>(`/api/document/download?key=${key}`)
    open(data)
  }
</script>
