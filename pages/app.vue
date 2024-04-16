<template>
  <NuxtPage />
</template>

<script setup lang="ts">
  import { RoutePath, RouteTitle } from '~/utils/routing'

  const route = useRoute()

  useHead({
    title: RouteTitle.App
  })

  definePageMeta({
    middleware: ['auth', 'cgu']
  })

  onMounted(() => {
    if (route.path === RoutePath.App()) {
      navigateTo(RoutePath.AppOverview())
    }
  })
</script>
