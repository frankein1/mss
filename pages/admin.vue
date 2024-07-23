<template>
  <NuxtPage />
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'

  const route = useRoute()

  useHead({
    title: routes.admin.Admin.title
  })

  definePageMeta({
    middleware: 'auth'
  })

  onMounted(() => {
    if (route.path === routes.admin.Admin.path()) {
      navigateTo(routes.admin.AdminStructures.path())
    }
  })
</script>
