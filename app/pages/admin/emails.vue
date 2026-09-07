<template>
  <PageContainer class="fr-p-5w">
    <PageTitle :title="routes.admin.AdminEmails.title" />

    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom fr-mb-6v">
      <div class="fr-col-12">
        <div class="fr-input-group">
          <label
            class="fr-label"
            for="search-strucuture"
          >
            Recherche e-mail
          </label>
          <div class="fr-input-wrap fr-input-wrap--addon">
            <input
              id="search-email"
              class="fr-input"
              aria-describedby="search-email-messages"
              type="text"
              @change="onSearch"
            />
            <button
              type="submit"
              class="fr-btn"
            >
              Chercher
            </button>
          </div>

          <div
            id="search-email-messages"
            class="fr-messages-group"
            aria-live="polite"
          ></div>
        </div>
      </div>
    </div>

    <div class="feature-section">
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
      <AtomPagination
        v-show="!pending"
        class="fr-mt-4w fr-px-5v"
        :page="page"
        :per-page="perPage"
        :total-pages="totalPages"
        @change-page="updatePagination($event)"
      />
    </div>
  </PageContainer>
</template>
<script lang="ts" setup>
  import type { EmailAdminSort } from '~~/types/table'
  import { SortOrder } from '~~/types/table'
  import type { EmailAdminFilterInput } from '~~/server/schema'
  import { REQUEST_LIMIT_DEFAULT } from '~/utils/constants'
  import { routes } from '~/utils/routes'

  const trpcClient = useTrpcClient()

  const search = ref<string>()
  const filters = ref<EmailAdminFilterInput>({})
  const orderBy = ref<EmailAdminSort>({ sentDate: SortOrder.Desc })
  const page = ref(1)
  const perPage = ref(REQUEST_LIMIT_DEFAULT)

  const { updatePagination } = usePagination(page, perPage, filters)

  const queryInput = computed(() => ({
    search: search.value,
    filters: filters.value,
    orderBy: orderBy.value,
    page: page.value,
    perPage: perPage.value
  }))

  const { data, pending, refresh } =
    await trpcClient.admin.getEmails.useQuery(queryInput)

  const emails = computed(() => data.value?.emails || [])

  const totalPages = computed(() => data.value?.totalPages || 0)

  function onSearch(event: Event) {
    const input = event.target as HTMLInputElement
    const value = input.value.trim()
    search.value = value
  }
</script>
