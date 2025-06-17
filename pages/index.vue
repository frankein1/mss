<script setup lang="ts">
  definePageMeta({
    middleware: ['auth']
  })

  navigateTo(useHomePage())
</script>

<template><AtomLoader /></template>
