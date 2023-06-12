<template>
  <NuxtPage />
</template>

<script setup lang="ts">
  import { RoutePath } from '~/utils/routing'

  const route = useRoute()

  definePageMeta({
    middleware: 'auth'
  })

  useLogoutInactiveUser()

  onMounted(() => {
    if (route.path === RoutePath.App()) {
      navigateTo(RoutePath.Overview())
    }
  })
</script>
