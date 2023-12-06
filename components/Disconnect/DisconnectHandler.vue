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
    public: { inactiveUserTimeThreshold }
  } = useRuntimeConfig()
  const modal = useModal()

  const timeThreshold = minutesToMillis(inactiveUserTimeThreshold)

  const counter = ref(timeThreshold)

  const disconnectBtn = ref<HTMLButtonElement>()

  let interval: Interval | null

  watch(counter, counter => {
    if (counter < 0) {
      logout()
    } else if (counter < minutesToMillis(5)) {
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
    logout()
  }

  function keepConnect() {
    if (counter.value < 0) {
      logout()
    } else {
      addListener()
    }
  }

  function openDisconnectAlert() {
    removeListener()
    modal.open({
      title: '',
      contentComponent: DisconnectAlert,
      contentComponentEvents: { disconnect, keepConnect }
    })
  }

  function removeListener() {
    window.removeEventListener('mousemove', startCountdown)
  }

  function addListener() {
    counter.value = timeThreshold
    window.addEventListener('mousemove', startCountdown)
  }

  onMounted(() => addListener())
  onUnmounted(() => {
    removeListener()
    stop()
  })
</script>
