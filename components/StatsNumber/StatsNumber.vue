<template>
  <div class="stats-number fr-display--md fr-mt-6w">{{ stats }}</div>
</template>

<script lang="ts" setup>
  defineProps<{
    totalCount: number
    stats: number
  }>()
</script>

<style lang="scss" scoped>
  .stats-number {
    display: flex;
    justify-content: center;
  }
</style>
