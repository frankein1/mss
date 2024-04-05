<template>
  <button
    ref="disconnectBtn"
    data-fr-opened="false"
    aria-controls="global-modal"
    class="disconnect-alert"
    @click="openDisconnectAlert"
  ></button>
</template>
<script setup lang="ts">
  import DisconnectAlert from './DisconnectAlert.vue'
  import { RoutePath } from '~/utils/routing'
  import { minutesToMillis } from '~/utils/time'

  type Interval = ReturnType<typeof setInterval>

  const {
    public: {
      disconnect: { alertThreshold, threshold }
    }
  } = useRuntimeConfig()
  const modal = useModal()

  const timeThreshold = minutesToMillis(threshold)

  const counter = ref(timeThreshold)

  const disconnectBtn = ref<HTMLButtonElement>()

  let interval: Interval | null

  const stopWatchingCounter = watch(counter, counter => {
    if (counter < 0) {
      logout()
    } else if (
      !modal.isOpen.value &&
      counter < minutesToMillis(alertThreshold)
    ) {
      disconnectBtn.value?.click()
    }
  })

  const stopWatchingIsOpen = watch(modal.isOpen, value => {
    if (!value) {
      resetCountDown()
    }
  })

  function clearCountdown() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  function startCountdown() {
    counter.value = timeThreshold
    interval = setInterval(() => {
      counter.value = counter.value - 1000
    }, 1000)
  }

  function resetCountDown() {
    if (!modal.isOpen.value) {
      counter.value = timeThreshold
    }
  }

  function logout() {
    if (process.client) {
      navigateTo(RoutePath.AuthLogout() + '?inactive=true')
    }
  }

  function disconnect() {
    logout()
  }

  function keepConnect() {
    counter.value = timeThreshold
    if (counter.value < 0) {
      logout()
    }
  }

  function openDisconnectAlert() {
    modal.open(DisconnectAlert, {
      title: `Vous allez être déconnecté.e dans ${alertThreshold} minutes`,
      disconnect,
      keepConnect
    })
  }

  onMounted(async () => {
    await nextTick()
    startCountdown()
    window.addEventListener('mousemove', resetCountDown)
  })

  onUnmounted(() => {
    window.addEventListener('mousemove', resetCountDown)
    clearCountdown()
    stopWatchingCounter()
    stopWatchingIsOpen()
  })
</script>

<style lang="scss" scoped>
  .disconnect-alert {
    display: none;
  }
</style>
