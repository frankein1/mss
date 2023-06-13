<template>
  <div class="pagetitle__container fr-mb-3w">
    <div class="pagetitle__titles">
      <div class="pagetitle__title">{{ title }}</div>
      <div class="pagetitle__subtitle">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    title: string
  }>()
</script>

<style lang="scss">
  .pagetitle__container {
    display: flex;
  }

  .pagetitle__titles {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .pagetitle__title {
    color: #00007d;
    font-size: xx-large;
    font-weight: bold;
  }

  .pagetitle__subtitle {
    font-size: small;
  }

  .pagetitle__required {
    color: red;
  }
</style>
