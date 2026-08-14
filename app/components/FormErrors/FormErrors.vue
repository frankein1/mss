<template>
  <AtomAlert
    ref="$el"
    class="fr-mb-4w"
    :alert-type="AlertType.Error"
    :message="alertMessage"
    tabindex="0"
  >
    <template #detailedMessage>
      <ul>
        <li
          v-for="error in errors"
          :key="error.name"
        >
          {{ error.message }}
        </li>
      </ul>
    </template>
  </AtomAlert>
</template>

<script setup lang="ts">
  import AtomAlert from '../AtomAlert/AtomAlert.vue'
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    errors: { name: string; message: string }[]
  }>()

  const $el = ref<typeof AtomAlert | null>()

  const alertMessage = computed(
    () => `Le formulaire contient ${props.errors.length} erreurs :`
  )

  onMounted(() => {
    if ($el.value) {
      $el.value.$el.focus()
    }
  })
</script>
