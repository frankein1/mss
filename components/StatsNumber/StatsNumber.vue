<template>
  <div>{{ stats }}</div>
</template>

<script lang="ts" setup>
  defineProps<{
    totalCount: number
    stats: number
  }>()
</script>
