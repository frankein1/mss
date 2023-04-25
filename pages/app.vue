<template>
  <NuxtPage />
</template>

<script setup lang="ts">
  import { Routes } from '~/utils/routing/routes'

  const route = useRoute()

  definePageMeta({
    middleware: 'auth'
  })

  onMounted(() => {
    if (route.path === Routes.App) {
      navigateTo(Routes.LoginSuccess)
    }
  })
</script>
