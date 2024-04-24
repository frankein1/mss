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
        @click="onView(document.key)"
      >
        {{ document.name }}</button
      ><template v-else>{{ document.name }} (confidentiel)</template
      ><template v-if="index != documents.length - 1">, </template>
    </span>
  </p>
</template>

<script lang="ts" setup>
  import { DocumentItems } from './types'

  defineProps<{
    documents: DocumentItems
  }>()

  const { open } = useDownload()

  const onView = async (key: string) => {
    const data = await $fetch<Blob>(`/api/s3/download?key=${key}`)
    open(data)
  }
</script>
