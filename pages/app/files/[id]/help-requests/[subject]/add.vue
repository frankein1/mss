<template>
  <PageContainer>
    <AtomBreadcrumb
      :links="
        breadcrumbs.helpRequest.AppFileHelpRequestAdd(
          familyFileId,
          familyFileIdentification,
          subject
        )
      "
    />
    <PageTitle
      :title="title"
      icon="fr-icon-questionnaire-fill"
      icon-variant="purple"
      :subtitle="subtitle"
      :subtitle-picto-path="subtitlePictoPath"
    >
      <RequiredFields />
    </PageTitle>
    <main ref="formContainer">
      <AtomLazyComponent
        :pending
        :error="Boolean(fetchError)"
        message="La liste des organismes instructeurs de votre structure n'a pas pu être chargée."
      >
        <HelpRequestFormCreation
          v-if="socialSupportSubjects && partnerOrganizations"
          :is-submitting="isSubmitting"
          :social-support-subjects="socialSupportSubjects"
          :family-file-id="familyFileId"
          :family-file-identification="familyFileIdentification || []"
          :beneficiary-id="getBeneficiaryIdOnPageLoad()"
          :partner-organizations="partnerOrganizations"
          :is-financial="isFinancial"
          @save-help-request="onAddHelpRequest"
        />
      </AtomLazyComponent>
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { FileInstructionType } from '@prisma/client'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { CreateHelpRequestInput } from '~/server/schema'
  import { toFirstLetterUpperCase } from '~/utils/toFirstLetterUpperCase'
  import { fileInstructionTypePictos } from '~/client/options'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const route = useRoute()

  const isSubmitting = ref<boolean>(false)
  const formContainer = ref<HTMLElement | null>(null)

  const familyFileId = route.params.id as string

  const subject = toFirstLetterUpperCase(
    route.params.subject as string
  ) as FileInstructionType
  const isFinancial = subject === FileInstructionType.Financial
  const subtitle = isFinancial ? 'Aide financière' : undefined
  const subtitlePictoPath = isFinancial
    ? fileInstructionTypePictos.Financial
    : undefined

  const { familyFileIdentification, getBeneficiaryIdOnPageLoad } =
    await useFamilyFileMinimalInfo(familyFileId)

  const title = computed(() => {
    if (
      familyFileIdentification &&
      familyFileIdentification.value?.length &&
      familyFileIdentification.value?.length === 1
    ) {
      return routes.helpRequest.AppBeneficiaryHelpRequestAdd.title(
        familyFileIdentification.value[0]
      )
    }
    return routes.helpRequest.AppBeneficiaryHelpRequestAdd.title(null)
  })

  useHead({ title })
  const {
    data: socialSupportSubjects,
    pending: socialSupportSubjectsPending,
    error: socialSupportSubjectsError
  } = await trpcClient.structure.getActiveSocialSupportSubjects.useQuery()

  const {
    data: partnerOrganizations,
    pending: partnerOrganizationsPending,
    error: partnerOrganizationsError
  } = await trpcClient.partner.getAll.useQuery()

  const pending = computed(
    () =>
      socialSupportSubjectsPending.value || partnerOrganizationsPending.value
  )

  const fetchError = computed(() => {
    if (socialSupportSubjectsError.value) {
      return "La liste des objets d'accompagnement de votre structure n'a pas pu être chargée."
    }
    if (partnerOrganizationsError.value) {
      return "La liste des organismes partneraires de votre structure n'a pas pu être chargée."
    }
    return ''
  })

  function onAddHelpRequest(helpRequest: CreateHelpRequestInput) {
    useTrpcMutation({
      mutation: () => trpcClient.helpRequest.add.mutate(helpRequest),
      isSubmitting,
      onSuccess: ({ socialSupportId }) => {
        navigateTo(
          routes.file.AppFile.path(helpRequest.familyFileId, {
            beneficiaryId: helpRequest.beneficiaryId,
            tab: BeneficiaryTab.History,
            item: socialSupportId
          })
        )
      },
      onFailure: () => {
        snackbar.error(
          "La création de l'instruction de dossier a échoué.",
          () => formContainer.value?.querySelector('input')?.focus()
        )
      }
    })
  }
</script>
