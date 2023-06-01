<template>
  <aside
    class="snackbar"
    :class="{ 'snackbar-open': open }"
  >
    <div>
      <AtomAlert
        v-if="open && alertType"
        :alert-type="alertType"
        :message="message"
        closeable
        @close="onClose"
      />
    </div>
  </aside>
</template>

<script lang="ts" setup>
  import type { AlertType } from '~/utils/constants/alert'
  import type { OpenSnackbarEvent } from '~/types/snackbar'

  const { $globalEventEmitter } = useNuxtApp()

  const open = ref(false)
  const alertType = ref<AlertType | null>(null)
  const message = ref('')
  const closeCallback = ref(() => {})

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
    closeCallback.value()
    open.value = false
    alertType.value = null
    message.value = ''
    closeCallback.value = function () {}
  }
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .snackbar {
    z-index: $above-z-index;
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
