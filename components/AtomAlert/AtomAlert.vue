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
    <p v-if="detailedMessage">{{ detailedMessage }}</p>
    <button
      v-if="closeable"
      ref="closeBtn"
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
      detailedMessage?: string
    }>(),
    { closeable: false, detailedMessage: '' }
  )

  const emit = defineEmits<{ (e: 'close'): void }>()

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

<style scoped>
  .fr-alert {
    background-color: #fff;
  }
</style>
