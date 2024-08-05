<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-if="error"
    :alert-type="AlertType.Error"
    :message
  />
  <template v-else>
    <slot />
  </template>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'

  interface Props {
    pending: boolean
    error: boolean
    message: string
  }

  defineProps<Props>()
</script>
