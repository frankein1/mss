<template>
  <div
    class="fr-alert"
    :class="[alertClass]"
    role="alert"
  >
    <div class="alert--text">
      <p
        v-if="message"
        class="fr-h5"
      >
        {{ message }}
      </p>
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
      message?: string
    }>(),
    { closeable: false, message: undefined }
  )

  const emit = defineEmits<{
    close: []
  }>()

  const alertClass = computed(() =>
    props.alertType ? `fr-alert--${props.alertType}` : ''
  )
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

  .fr-alert--info,
  .fr-alert--warning {
    .alert--image {
      display: none;

      @include dsfr-media-query.respond-from('md') {
        display: block;
        min-width: 80px;
        background-repeat: no-repeat;
        background-position-y: center;
      }
    }
  }

  .fr-alert--warning {
    background-color: #ffe9e6;

    .alert--image {
      @include dsfr-media-query.respond-from('md') {
        background-image: url('/pictograms/alerte.svg');
        background-position-y: center;
      }
    }
  }

  .fr-alert--info {
    background-color: var(--background-alt-blue-france);

    .alert--image {
      @include dsfr-media-query.respond-from('md') {
        background-image: url('/pictograms/information.svg');
      }
    }
  }
</style>
