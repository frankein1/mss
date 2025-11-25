<template>
  <AtomLazyComponent
    :pending="status === 'pending'"
    :error="!!error"
    message="Le contenu de cet accompagnement n'a pas pu être chargé"
  >
    <BeneficiaryHistoryDetailsBodyContent
      v-if="socialSupport"
      :item="socialSupport"
      :family-file-permissions="familyFilePermissions"
      @deleted="emit('deleted')"
    />
  </AtomLazyComponent>
</template>

<script setup lang="ts">
  import type { FamilyFilePermissions } from '~/server/security'

  const props = defineProps<{
    socialSupportId: string
    familyFilePermissions: FamilyFilePermissions
  }>()

  const emit = defineEmits<{
    deleted: []
  }>()

  const trpcClient = useTrpcClient()
  const { data, status, error } = trpcClient.socialSupport.getDetails.useQuery({
    id: props.socialSupportId
  })
  const socialSupport = computed(() => data.value)
</script>
