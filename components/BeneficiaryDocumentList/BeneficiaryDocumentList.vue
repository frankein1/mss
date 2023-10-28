<template>
  <div class="feature-section documents-header-section">
    <BeneficiaryDocumentFilters @filter="filters = $event" />
    <BeneficiaryDocumentAddButton
      :beneficiary-id="beneficiary.id"
      @refresh-documents="refresh"
    />
  </div>
  <div class="feature-section fr-mt-2w">
    <p v-if="documentsTotal">
      {{ documents.length }} document(s) affiché(s) sur
      {{ documentsTotal }} disponible(s) dans l'historique du bénéficiaire
    </p>
    <AtomAlert
      v-if="error"
      class="fr-mx-5v"
      :alert-type="AlertType.Error"
      message="La liste des documents n'a pas pu être chargée."
    />
    <template v-else>
      <AtomLoader
        v-show="pending"
        class="fr-mx-auto"
      />
      <BeneficiaryDocumentTable
        v-show="!pending"
        v-model:sort="orderBy"
        :documents="documents"
        :pending="pending"
        :beneficiary="beneficiary"
        @refresh-documents="refresh"
      />
      <AtomPagination
        v-show="!pending"
        class="fr-mt-4w fr-px-5v"
        :page="page"
        :total-pages="totalPages"
        no-limit-selection
        @change-page="updatePagination($event)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { REQUEST_LIMIT_DEFAULT } from '~/utils/constants'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { focusAndScrollTo } from '~/utils/focusAnScrollTo'
  import { GetBeneficiaryOutput } from '~/server/trpc/routers'
  import type { BeneficiaryDocumentFilterInput } from '~/server/schema'
  import { BeneficiaryDocumentSort, SortOrder } from '~/types/table'
  import { AlertType } from '~/utils/constants/alert'

  const route = useRoute()
  const trpcClient = useTrpcClient()

  const props = defineProps<{ beneficiary: GetBeneficiaryOutput }>()

  const filters = ref<BeneficiaryDocumentFilterInput>({})
  const orderBy = ref<BeneficiaryDocumentSort[]>([{ created: SortOrder.Desc }])
  const page = ref(1)
  const perPage = ref(REQUEST_LIMIT_DEFAULT)

  const { updatePagination } = usePagination(page, perPage)

  const queryInput = computed(() => ({
    beneficiaryId: props.beneficiary.id,
    filters: filters.value,
    orderBy: orderBy.value,
    page: page.value,
    perPage: perPage.value
  }))

  const {
    data: documentsRequest,
    error,
    pending,
    refresh
  } = await trpcClient.beneficiary.getBeneficiaryDocuments.useQuery(queryInput)

  const documents = computed(() => documentsRequest.value?.documents || [])

  const totalPages = computed(() => documentsRequest.value?.totalPages || 0)

  const documentsTotal = computed(() => documentsRequest.value?.totalCount || 0)

  onMounted(async () => {
    const tab = route.hash.slice(1)
    const { item } = route.query

    if (tab === BeneficiaryTab.Documents && item) {
      await nextTick()

      focusAndScrollTo(`#document-${item}`)
    }
  })
</script>

<style scoped>
  .documents-header-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .documents-header-section div:first-child {
    flex-grow: 1;
  }
</style>
