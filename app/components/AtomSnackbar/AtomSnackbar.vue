<template>
  <aside
    class="snackbar"
    :class="{ 'snackbar-open': open }"
  >
    <div role="alert">
      <AtomAlert
        v-if="open && alertType"
        :alert-type="alertType"
        :message="message"
        :closeable="isCloseable"
        @close="onClose"
      />
    </div>
  </aside>
</template>

<script lang="ts" setup>
  import type { AlertType } from '~/utils/constants/alert'
  import type { OpenSnackbarEvent } from '~~/types/snackbar'

  const { $globalEventEmitter } = useNuxtApp()

  const open = ref(false)
  const alertType = ref<AlertType | null>(null)
  const message = ref('')
  const closeCallback = ref<(() => void) | undefined>()

  /**
   * Only offer a close button when the caller gave something to run on close,
   * typically restoring focus. Otherwise the snackbar just auto-dismisses.
   */
  const isCloseable = computed(() => closeCallback.value !== undefined)

  onMounted(() => {
    $globalEventEmitter.on('openSnackbar', onOpen)
  })

  function onOpen({
    snackbarType,
    message: _message,
    closeCallback: _closeCallback,
    duration
  }: OpenSnackbarEvent) {
    open.value = true
    alertType.value = snackbarType
    message.value = _message
    closeCallback.value = _closeCallback

    if (duration !== 0) {
      setTimeout(onClose, duration)
    }
  }

  function onClose() {
    closeCallback.value?.()
    open.value = false
    alertType.value = null
    message.value = ''
    closeCallback.value = undefined
  }
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .snackbar {
    z-index: $over-modal-z-index;
    margin: 2rem;
    display: none;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;

    &.snackbar-open {
      display: flex;
    }

    > * {
      box-shadow: $shadow-dark;

      @include dsfr-media-query.respond-from('md') {
        max-width: 75%;
      }

      @include dsfr-media-query.respond-from('lg') {
        max-width: 50%;
      }
    }
  }
</style>
