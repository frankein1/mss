<template>
  <NuxtPage />
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: 'auth',
    layout: 'landing'
  })

  useLogoutInactiveUser()
</script>

<style>
  .fr-container article:nth-child(2) {
    max-height: 85vh;
    overflow: scroll;
  }
</style>
