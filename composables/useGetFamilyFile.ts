import type { ShallowRef, InjectionKey } from 'vue'
import { REQUEST_LIMIT_DEFAULT } from '~/utils/constants'
import type { BeneficiaryDocumentFilterInput } from '~/server/schema'
import { BeneficiaryDocumentSort, SortOrder } from '~/types/table'
import { FamilyFileHistoryFilterInput } from '~/server/schema'

export const useGetFamilyFile = async (familyFileId: string) => {
  const trpcClient = useTrpcClient()

  /** Inputs */

  // Input for family file documents
  const documentsFilters = ref<BeneficiaryDocumentFilterInput>({})
  const documentsOrderBy = ref<BeneficiaryDocumentSort>({
    created: SortOrder.Desc
  })
  const documentsPage = ref(1)
  const documentsPerPage = ref(REQUEST_LIMIT_DEFAULT)

  const { updatePagination: updateDocumentPagination } = usePagination(
    documentsPage,
    documentsPerPage,
    documentsFilters
  )

  const documentsQueryInput = computed(() => ({
    familyFileId,
    filters: documentsFilters.value,
    orderBy: documentsOrderBy.value,
    page: documentsPage.value,
    perPage: documentsPerPage.value
  }))

  // Input for family file social supports
  const socialSupportsFilters = ref<FamilyFileHistoryFilterInput>({})

  const socialSupportsQueryInput = computed(() => ({
    familyFileId,
    filters: socialSupportsFilters.value
  }))

  /** API call */

  // Batch call for family file
  const [familyFile, documents, socialSupports, budget] = await Promise.all([
    trpcClient.file.getFamilyFileMinimalInfo.useQuery(
      { id: familyFileId },
      { queryKey: 'getFamilyFile.minimalInfo' }
    ),
    trpcClient.file.getDocuments.useQuery(documentsQueryInput, {
      queryKey: 'getFamilyFile.documents'
    }),
    trpcClient.file.getSocialSupports.useQuery(socialSupportsQueryInput, {
      queryKey: 'getFamilyFile.history'
    }),
    trpcClient.budget.getBudget.useQuery(
      { familyFileId },
      { queryKey: 'getFamilyFile.budget' }
    )
  ])

  /** Reactive values */

  // family file reactives
  const familyFileIdentification = computed(() =>
    familyFile.data.value && familyFile.data.value.beneficiaries
      ? familyFile.data.value.beneficiaries
      : null
  )

  /** Utils */

  // family file utils
  const route = useRoute()

  const getBeneficiaryIdOnPageLoad = () => {
    const queryBeneficiaryId = route.query.beneficiaryId as string

    const defaultBeneficiaryId =
      familyFileIdentification.value &&
      familyFileIdentification.value.length > 0
        ? familyFileIdentification.value[0].id
        : ''

    return queryBeneficiaryId || defaultBeneficiaryId
  }

  return {
    familyFile,
    familyFileIdentification,
    getBeneficiaryIdOnPageLoad,
    documents,
    documentsFilters,
    documentsOrderBy,
    documentsPage,
    documentsPerPage,
    documentsQueryInput,
    updateDocumentPagination,
    socialSupports,
    socialSupportsFilters,
    socialSupportsQueryInput,
    budget
  }
}

export type GetFamilyFile = Awaited<ReturnType<typeof useGetFamilyFile>>

export const getFamilyFileInjectionKey: InjectionKey<GetFamilyFile> =
  Symbol('getFamilyFile')
