<template>
  <NuxtPage />
</template>

<script setup lang="ts">
  import { Routes } from '~/utils/routing/routes'

  const route = useRoute()

  definePageMeta({
    middleware: 'auth'
  })

  useLogoutInactiveUser()

  onMounted(() => {
    if (route.path === Routes.App()) {
      navigateTo(Routes.Overview())
    }
  })
</script>
