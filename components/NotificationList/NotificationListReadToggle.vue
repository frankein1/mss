<template>
  <form class="notification-read-toggle">
    <VeeToggle
      label="Afficher les notifications lues"
      name="read"
      :checked-label="false"
    />
  </form>
</template>

<script setup lang="ts">
  const props = defineProps<{
    read: boolean
  }>()

  const emit = defineEmits<{
    'update:read': [read: boolean]
  }>()

  const { controlledValues, setFieldValue } = useForm<{ read: boolean }>({
    initialValues: { read: props.read }
  })

  watch(
    () => props.read,
    read => {
      setFieldValue('read', read)
    }
  )

  watch(controlledValues, ({ read }) => {
    emit('update:read', read)
  })
</script>

<style lang="scss" scoped>
  .notification-read-toggle {
    margin-top: -1rem;

    :deep(.fr-toggle label.fr-toggle__label) {
      width: auto;
    }
  }
</style>
