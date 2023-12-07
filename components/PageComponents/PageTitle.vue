<template>
  <div
    class="pagetitle__container"
    :class="{ 'fr-mb-4w': !noMargin }"
  >
    <div
      v-if="icon"
      class="pagetitle__icon fr-mr-4w"
      :class="[iconColorClass, iconBackgroundClass]"
    >
      <span
        :class="[icon]"
        aria-hidden="true"
      ></span>
    </div>
    <div class="pagetitle__titles">
      <h1 class="pagetitle__title fr-mb-0">{{ title }}</h1>
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
  withDefaults(
    defineProps<{
      title: string
      noMargin?: boolean
      icon?: string
      iconColorClass?: string
      iconBackgroundClass?: string
    }>(),
    { noMargin: false, icon: '', iconColorClass: '', iconBackgroundClass: '' }
  )

  const slots = useSlots()

  const hasSubtitle = computed(() => slots.default)
</script>

<style lang="scss">
  .pagetitle__container {
    display: flex;
    align-items: center;
  }

  .pagetitle__icon {
    color: var(--primary);
    background-color: var(--primary-light);
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.75rem;
    height: fit-content;
    width: fit-content;

    span::before {
      --icon-size: 2rem;
    }
  }

  .pagetitle__titles {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .pagetitle__title {
    color: var(--blue-france-sun-113-625);
  }

  .pagetitle__subtitle {
    font-size: small;
  }

  .pagetitle__required {
    color: red;
  }
</style>
