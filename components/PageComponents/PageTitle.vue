<template>
  <div
    class="pagetitle__container"
    :class="{ 'fr-mb-3w': !noMargin }"
  >
    <div class="pagetitle__titles">
      <h1 class="pagetitle__title fr-mb-0">{{ title }}</h1>
      <div class="pagetitle__subtitle">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      title: string
      noMargin?: boolean
    }>(),
    { noMargin: false }
  )
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
  }

  .pagetitle__subtitle {
    font-size: small;
  }

  .pagetitle__required {
    color: red;
  }
</style>
