<template>
  <hr />
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

  const pauseWatch = ref(true)

  const { controlledValues, setFieldValue } = useForm<{ read: boolean }>({
    initialValues: { read: props.read }
  })

  watch(
    () => props.read,
    read => {
      setFieldValue('read', read)
      pauseWatch.value = true
    }
  )

  watch(controlledValues, ({ read }) => {
    if (pauseWatch.value) {
      pauseWatch.value = false
    } else {
      emit('update:read', read)
    }
  })
</script>

<style lang="scss" scoped>
  .notification-read-toggle {
    padding: 0 1rem 0.5rem;
    margin-top: -1rem;
    display: flex;
    justify-content: flex-end;

    :deep(.fr-toggle label.fr-toggle__label) {
      width: auto;
    }
  }
</style>
