<template>
  <div class="fr-p-2w">
    <div>
      <label class="fr-label"> Recherche </label>
      <input
        class="fr-input"
        placeholder="email"
        @change="onSearch"
      />
    </div>
    <EmailFiltersAdmin
      class="fr-px-5v fr-mt-2w"
      @filter="filters = $event"
    />
    <EmailTableAdmin
      v-show="!pending"
      v-model:sort="orderBy"
      :emails="emails"
      :pending="pending"
      @refresh-emails="refresh"
    />
  </div>
</template>
<script lang="ts" setup>
  import { EmailAdminSort, SortOrder } from '~/types/table'
  import type { EmailAdminFilterInput } from '~/server/schema'

  const trpcClient = useTrpcClient()

  const search = ref<string>()
  const filters = ref<EmailAdminFilterInput>({})
  const orderBy = ref<EmailAdminSort[]>([{ sentDate: SortOrder.Desc }])

  const queryInput = computed(() => ({
    search: search.value,
    filters: filters.value,
    orderBy: orderBy.value
  }))

  const { data, pending, refresh } =
    await trpcClient.admin.getEmails.useQuery(queryInput)

  const emails = computed(() => data.value?.emails || [])

  function onSearch(event: Event) {
    const input = event.target as HTMLInputElement
    const value = input.value.trim()
    search.value = value
  }
</script>
