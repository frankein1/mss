<template>
  <NuxtPage />
</template>

<script setup lang="ts">
  import { RouteTitle } from '~/utils/routing'

  useHead({
    title: RouteTitle.CGUManager()
  })

  definePageMeta({
    middleware: 'auth',
    layout: 'landing'
  })
</script>
