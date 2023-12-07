<template>
  <NuxtPage />
</template>

<script setup lang="ts">
  import { RoutePath, RouteTitle } from '~/utils/routing'

  const route = useRoute()

  useHead({
    title: RouteTitle.Admin()
  })

  definePageMeta({
    middleware: 'auth'
  })

  onMounted(() => {
    if (route.path === RoutePath.Admin()) {
      navigateTo(RoutePath.AdminStructures())
    }
  })
</script>
