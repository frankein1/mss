<template>
  <StructureSupport
    :social-support-subjects="socialSupportSubjects"
    @refresh="emit('refresh')"
  />
</template>

<script lang="ts" setup>
  import type { SocialSupportSubjects as SocialSupportSubjectsData } from '~/components/Structure/types'

  defineOptions({ inheritAttrs: false })

  defineProps<{
    socialSupportSubjects?: SocialSupportSubjectsData
  }>()

  const emit = defineEmits<{ refresh: [] }>()
</script>
