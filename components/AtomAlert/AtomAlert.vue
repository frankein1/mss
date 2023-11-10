<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="fr-alert"
    :class="[alertClass]"
    role="alert"
  >
    <p
      class="fr-alert__title"
      v-html="text"
    ></p>
    <slot name="detailedMessage"></slot>
  </div>
  <button
    v-if="closeable"
    ref="closeBtn"
    class="fr-btn--close fr-btn force-focus-visible"
    @click="emit('close')"
  >
    Masquer le message
  </button>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'

  const props = withDefaults(
    defineProps<{
      alertType: AlertType
      closeable?: boolean
      message: string
    }>(),
    { closeable: false }
  )

  const emit = defineEmits<{
    close: []
  }>()

  const closeBtn = ref<HTMLButtonElement | null>(null)

  const alertClass = computed(() =>
    props.alertType ? `fr-alert--${props.alertType}` : ''
  )

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

  onMounted(() => {
    if (props.closeable) {
      closeBtn.value?.focus()
    }
  })
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .fr-alert {
    background-color: #fff;
  }
</style>
