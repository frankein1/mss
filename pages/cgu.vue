<template>
  <NuxtPage />
</template>

<script setup lang="ts">
  import { routes } from '~/routes'

  useHead({
    title: routes.cgu.CGUManager.title
  })

  definePageMeta({
    middleware: 'auth',
    layout: 'landing'
  })
</script>
