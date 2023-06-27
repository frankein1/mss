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
