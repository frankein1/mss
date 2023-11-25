<template>
  <div class="fr-p-2w">
    <EmailFiltersAdmin
      class="fr-px-5v fr-mt-2w"
      @filter="filters = $event"
    />
    <EmailTableAdmin
      v-show="!pending"
      v-model:sort="orderBy"
      :emails="emails"
      :pending="pending"
    />
  </div>
</template>
<script lang="ts" setup>
  import { EmailAdminSort } from '~/types/table'
  import type { EmailAdminFilterInput } from '~/server/schema'

  const trpcClient = useTrpcClient()

  const filters = ref<EmailAdminFilterInput>({})
  const orderBy = ref<EmailAdminSort[]>([])

  const queryInput = computed(() => ({
    filters: filters.value,
    orderBy: orderBy.value
  }))

  const { data, pending } =
    await trpcClient.admin.getEmails.useQuery(queryInput)

  const emails = computed(() => data.value?.emails || [])
</script>
