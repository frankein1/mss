<template>
  <div class="fr-container">
    <div class="beneficiary-section fr-p-3w">
      <BeneficiaryDocumentAddButton
        :beneficiary-id="beneficiary.id"
        @refresh-documents="refresh"
      />
      <BeneficiaryDocumentFilters @filter="filters = $event" />
    </div>
    <div class="beneficiary-section fr-p-3w fr-mt-2w">
      <p v-if="documentsTotal">
        {{ documentsTotal }} document(s) disponibles dans l'historique du
        bénéficiaire
      </p>
      <AtomAlert
        v-if="error"
        class="fr-mx-5v"
        :alert-type="AlertType.Error"
        message="La liste des documents n'a pas pu être chargée."
      />
      <AtomLoader
        v-else-if="pending"
        class="fr-mx-auto"
      />
      <BeneficiaryDocumentTable
        v-else
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
        @change-page="updatePagination($event)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { REQUEST_LIMIT_DEFAULT } from '~/utils/constants'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { focusAndScrollTo } from '~/utils/focusAnScrollTo'
  import { GetBeneficiaryOutput } from '~/server/routers'
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
