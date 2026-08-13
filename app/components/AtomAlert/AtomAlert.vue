<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="fr-alert"
    :class="[alertClass]"
    role="alert"
  >
    <component
      :is="titleTag"
      class="fr-alert__title"
      >{{ text }}</component
    >
    <slot name="detailedMessage"></slot>
    <button
      v-if="closeable"
      v-autofocus
      type="button"
      class="fr-btn--close fr-btn force-focus-visible"
      @click="emit('close')"
    >
      Masquer le message
    </button>
  </div>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'

  const props = withDefaults(
    defineProps<{
      alertType: AlertType
      closeable?: boolean
      message: string
      titleTag?: keyof HTMLElementTagNameMap
      size?: 'md' | 'sm'
    }>(),
    { closeable: false, titleTag: 'p', size: 'md' }
  )

  const emit = defineEmits<{
    close: []
  }>()

  const alertClass = computed(() => {
    let classBase = `fr-alert--${props.alertType}`
    if (props.size === 'sm') {
      classBase = classBase + ' fr-alert--sm'
    }
    return classBase
  })

  const text = computed(() => {
    switch (props.alertType) {
      case AlertType.Error:
        return `Erreur : ${props.message}`
      case AlertType.Info:
        return `Information : ${props.message}`
      case AlertType.Warning:
        return `Attention : ${props.message}`
      default:
        return props.message
    }
  })
</script>

<style lang="scss" scoped>
  .fr-alert {
    background-color: #fff;
  }
</style>
