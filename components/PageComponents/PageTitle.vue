<template>
  <div class="pagetitle__container fr-mb-3w">
    <div
      v-if="icon"
      class="pagetitle__icon fr-mr-2w"
    >
      <span
        :class="[icon]"
        aria-hidden="true"
      ></span>
    </div>
    <div class="pagetitle__titles">
      <div class="pagetitle__title">{{ title }}</div>
      <div
        v-if="hasSubtitle"
        class="pagetitle__subtitle fr-mt-1w"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    title: string
    icon?: string
  }>()

  const slots = useSlots()

  const hasSubtitle = computed(() => slots.default)
</script>

<style lang="scss">
  .pagetitle__container {
    display: flex;
    gap: 1rem;
  }

  .pagetitle__icon {
    color: var(--primary);
    background-color: var(--primary-light);
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;

    span::before {
      --icon-size: 2rem;
    }
  }

  .pagetitle__titles {
    display: flex;
    gap: 0.5rem;
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
