<template>
  <span
    class="loader"
    :style="style"
  ></span>
</template>

<script setup>
  const props = defineProps({
    inlined: { type: Boolean, default: false },
    borderColor: { type: String, default: 'var(--primary)' },
    diameter: { type: Number, default: 48 }
  })

  const BORDER_PERCENTAGE = 0.1
  const style = computed(() => ({
    'width': `${props.diameter * (1 - BORDER_PERCENTAGE)}px`,
    'height': `${props.diameter * (1 - BORDER_PERCENTAGE)}px`,
    'border-width': `${props.diameter * BORDER_PERCENTAGE}px`,
    'border-top-color': props.borderColor,
    'border-right-color': props.borderColor,
    'border-left-color': props.borderColor,
    'display': props.inlined ? 'inline-block' : 'block'
  }))
</script>

<style lang="scss" scoped>
  @use '~/assets/style/loader' as loader;

  .loader {
    @include loader.loader;
  }
</style>
