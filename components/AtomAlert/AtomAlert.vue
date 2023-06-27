<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="fr-alert"
    :class="[alertClass]"
    role="alert"
  >
    <div class="info-container">
      <div>
        <p
          class="fr-alert__title"
          v-html="text"
        ></p>
        <p
          v-if="detailedMessage"
          v-html="detailedMessage"
        ></p>
      </div>
      <div v-if="action">
        <button
          :class="`fr-btn fr-btn--md fr-btn--secondary fr-btn--icon-left ${action.iconClass}`"
          :type="action.type"
          @click="emit('action')"
        >
          {{ action.title }}
        </button>
      </div>
    </div>
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
      action?: {
        title: string
        iconClass?: string
        type?: 'button' | 'submit' | 'reset'
      } | null
    }>(),
    { closeable: false, detailedMessage: '', action: null }
  )

  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'action'): void
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

  .info-container {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;

    @include dsfr-media-query.respond-from('lg') {
      flex-direction: row;
    }

    div {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
</style>
