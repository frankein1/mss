<template>
  <BeneficiaryDocumentNotice />
  <section class="feature-section documents-header-section fr-mt-2w">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
          <h3 class="fr-sr-only">Filtres</h3>
        </div>
        <div class="fr-col-12">
          <BeneficiaryDocumentFilters
            :family-file-identification="familyFileIdentification || []"
            @filter="documentsFilters = $event"
          />
        </div>
        <div class="fr-col-12">
          <BeneficiaryDocumentAddButton
            :family-file-id="familyFileId"
            :family-file-identification="familyFileIdentification || []"
            @new-document="() => refresh()"
          />
        </div>
      </div>
    </div>
  </section>
  <section class="feature-section fr-mt-2w">
    <h3 class="fr-sr-only">Liste des documents</h3>
    <p v-if="documentsCount">{{ documentsCount }} document(s)</p>
    <AtomAlert
      v-if="error"
      class="fr-mx-5v"
      :alert-type="AlertType.Error"
      message="La liste des documents n'a pas pu être chargée."
    />

    <template v-else-if="docs">
      <BeneficiaryDocumentTable
        v-model:sort="documentsOrderBy"
        :documents="documents"
        :family-file-identification="familyFileIdentification || []"
        :pending
        @document-updated="onDocumentUpdated"
        @document-deleted="onDocumentDeleted"
      />
      <AtomPagination
        class="fr-mt-4w fr-px-5v"
        :page="documentsPage"
        :per-page="documentsPerPage"
        :total-pages="totalPages"
        no-limit-selection
        @change-page="updateDocumentPagination($event)"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
  import { GetDocument } from './types'
  // import { REQUEST_LIMIT_DEFAULT } from '~/utils/constants'
  // import type { BeneficiaryDocumentFilterInput } from '~/server/schema'
  // import { BeneficiaryDocumentSort, SortOrder } from '~/types/table'
  import { AlertType } from '~/utils/constants/alert'
  // import { BeneficiaryFileIdentification } from '~/types/beneficiary'
  import {
    useGetFamilyFile,
    getFamilyFileInjectionKey
  } from '~/composables/useGetFamilyFile'

  // const trpcClient = useTrpcClient()

  const props = defineProps<{
    familyFileId: string
    // familyFileIdentification: BeneficiaryFileIdentification[]
  }>()

  const {
    familyFileIdentification,
    documents: docs,
    documentsFilters,
    documentsOrderBy,
    documentsPage,
    documentsPerPage,
    updateDocumentPagination
  } = inject(
    getFamilyFileInjectionKey,
    await useGetFamilyFile(props.familyFileId)
  )

  const { data, error, pending, refresh } = docs

  // const filters = ref<BeneficiaryDocumentFilterInput>({})
  // const orderBy = ref<BeneficiaryDocumentSort>({ created: SortOrder.Desc })
  // const page = ref(1)
  // const perPage = ref(REQUEST_LIMIT_DEFAULT)

  // const { updatePagination } = usePagination(page, perPage, filters)

  // const queryInput = computed(() => ({
  //   familyFileId: props.familyFileId,
  //   filters: filters.value,
  //   orderBy: orderBy.value,
  //   page: page.value,
  //   perPage: perPage.value
  // }))

  // const { data, error, pending, refresh } =
  //   await trpcClient.file.getDocuments.useQuery(queryInput, {
  //     queryKey: 'getDocuments'
  //   })

  const documents = computed(() => data.value?.documents || [])

  const totalPages = computed(() => data.value?.totalPages || 0)

  const documentsCount = computed(() => data.value?.count || 0)

  function onDocumentUpdated(updatedDocument: GetDocument) {
    if (!data.value) {
      return
    }
    data.value.documents = data.value.documents.map(documentItem =>
      documentItem.document.key === updatedDocument.key
        ? { document: updatedDocument, permissions: documentItem.permissions }
        : documentItem
    )
  }

  function onDocumentDeleted(documentKey: string) {
    if (!data.value) {
      return
    }

    data.value.count--
    data.value.documents = data.value.documents.filter(
      ({ document: { key } }) => key !== documentKey
    )
  }
</script>

<style scoped lang="scss">
  .documents-header-section {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > :deep(*:first-child) {
      flex-grow: 1;
    }

    > :deep(*:last-child) {
      flex-shrink: 0;
    }
  }
</style>
