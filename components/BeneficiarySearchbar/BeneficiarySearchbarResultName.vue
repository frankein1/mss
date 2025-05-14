<template>
  <div class="fr-grid-row">
    <span
      v-for="span in weightTexts"
      :key="span.text"
      class="whitespace-pre-wrap"
      :class="{
        'fr-text--bold': span.weight === 'bold'
      }"
    >
      {{ span.text }}
    </span>
  </div>
</template>

<script lang="ts" setup>
  const { name, input = '' } = defineProps<{
    name: string
    input?: string
  }>()

  const weightTexts = computed(() =>
    emphasizeSearch({ input: name, searchString: input })
  )
</script>
