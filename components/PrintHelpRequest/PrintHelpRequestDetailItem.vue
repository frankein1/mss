<template>
  <li
    v-if="content"
    class="details"
    style="white-space: pre-line"
  >
    <span class="fr-text--bold">{{ title }} : </span>
    <br v-if="title === 'Compte rendu'" />
    {{ content }}
  </li>
</template>

<script lang="ts" setup>
  defineProps<{
    title: string
    content: string | number | null | undefined
  }>()
</script>

<style scoped>
  .details {
    margin-bottom: 0.5rem;
  }
</style>
