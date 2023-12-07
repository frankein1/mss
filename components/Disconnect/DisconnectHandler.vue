<template>
  <button
    ref="disconnectBtn"
    data-fr-opened="false"
    aria-controls="global-modal"
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
  const isOpen = ref(false)

  const disconnectBtn = ref<HTMLButtonElement>()

  let interval: Interval | null

  watch(counter, counter => {
    if (counter < 0) {
      logout()
    } else if (!isOpen.value && counter < minutesToMillis(alertThreshold)) {
      disconnectBtn.value?.click()
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
    clearCountdown()
    interval = setInterval(() => {
      counter.value = counter.value - 1000
    }, 1000)
  }

  function logout() {
    if (process.client) {
      navigateTo(RoutePath.AuthLogout() + '?inactive=true')
    }
  }

  function disconnect() {
    isOpen.value = false
    logout()
  }

  function keepConnect() {
    isOpen.value = false
    counter.value = timeThreshold
    if (counter.value < 0) {
      logout()
    } else {
      addListener()
    }
  }

  function openDisconnectAlert() {
    isOpen.value = true
    removeListener()
    modal.open({
      title: '',
      hideCloseButton: true,
      contentComponent: DisconnectAlert,
      contentComponentEvents: { disconnect, keepConnect }
    })
  }

  function removeListener() {
    window.removeEventListener('mousemove', startCountdown)
  }

  function addListener() {
    window.addEventListener('mousemove', startCountdown)
  }

  onNuxtReady(() => {
    startCountdown()
    addListener()
  })

  onUnmounted(() => {
    removeListener()
    stop()
  })
</script>
