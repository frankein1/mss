import type { InjectionKey } from 'vue'
import { REQUEST_LIMIT_DEFAULT } from '~/utils/constants'
import type { BeneficiaryDocumentFilterInput } from '~/server/schema'
import { BeneficiaryDocumentSort, SortOrder } from '~/types/table'
import { FamilyFileHistoryFilterInput } from '~/server/schema'

export const useGetFamilyFile = async (familyFileId: string) => {
  const trpcClient = useTrpcClient()
  const { application } = usePermissions()
  const route = useRoute()

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
  const [familyFile, documents, socialSupports, examinationDates, budget] =
    await Promise.all([
      trpcClient.file.getFamilyFileMinimalInfo.useQuery(
        { id: familyFileId },
        { queryKey: 'getFamilyFile.minimalInfo' }
      ),
      trpcClient.file.getDocuments.useQuery(documentsQueryInput, {
        queryKey: 'getFamilyFile.documents'
      }),
      // TODO replace by getSocialSupportsSummary
      trpcClient.file.getSocialSupports.useQuery(socialSupportsQueryInput, {
        queryKey: 'getFamilyFile.history'
      }),
      application.value.module.helpRequest
        ? trpcClient.file.getExaminationDates.useQuery(
            { id: familyFileId },
            {
              transform: dates =>
                dates.map(({ examinationDate: date }) => ({
                  value: date?.toString() || '',
                  label: formatDate(date)
                })),
              queryKey: 'getFamilyFile.fileInstructions.examinationDates'
            }
          )
        : { data: ref([]), pending: ref(false), error: ref(null) },
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
    examinationDates,
    budget
  }
}

export type GetFamilyFile = Awaited<ReturnType<typeof useGetFamilyFile>>

export const getFamilyFileInjectionKey: InjectionKey<GetFamilyFile> =
  Symbol('getFamilyFile')
