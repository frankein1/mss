<template>
  <div class="formtitle__container">
    <div>
      <div class="formtitle__title">{{ title }}</div>
      <div class="formtitle__subtitle">
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
  .formtitle__container {
    display: flex;
  }

  .formtitle__title {
    color: #00007d;
    font-size: xx-large;
    font-weight: bold;
    padding-bottom: 0.5em;
  }

  .formtitle__subtitle {
    font-size: small;
  }

  .formtitle__required {
    color: red;
  }
</style>
