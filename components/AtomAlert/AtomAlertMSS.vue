<template>
  <div
    class="fr-alert"
    :class="[alertClass]"
    role="alert"
  >
    <div class="alert--text">
      <p class="fr-h5">{{ text }}</p>
      <slot name="detailedMessage"></slot>
    </div>
    <div class="alert--image">
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
  </div>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'

  const props = withDefaults(
    defineProps<{
      alertType: AlertType
      closeable?: boolean
      message: string
    }>(),
    { closeable: false, titleTag: 'p' }
  )

  const emit = defineEmits<{
    close: []
  }>()

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
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .fr-alert {
    background-color: #fff;
    display: flex;
    gap: 1rem;
    background-size:
      100% 0,
      0 100%,
      100% 0,
      4px 100%;
    padding: 2rem 3rem;

    &::before {
      display: none;
    }
  }

  .fr-alert--warning {
    background-color: #ffe9e6;

    .alert--image {
      display: none;

      @include dsfr-media-query.respond-from('md') {
        display: block;
        min-width: 80px;
        background-image: url('/pictograms/alerte.svg');
        background-repeat: no-repeat;
        background-position-y: center;
      }
    }
  }
</style>
