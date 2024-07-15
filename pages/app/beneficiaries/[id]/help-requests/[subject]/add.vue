<template>
  <PageContainer>
    <DsfrBreadcrumb
      :links="Breadcrumb.AppBeneficiaryHelpRequestAdd(beneficiary, subject)"
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
    <main
      ref="formContainer"
      class="feature-section fr-p-5w"
    >
      <AtomAlert
        v-if="fetchError"
        :alert-type="AlertType.Error"
        :message="fetchError"
      />

      <AtomLoader
        v-if="pending"
        class="fr-mx-auto"
      />
      <HelpRequestFormCreation
        v-else-if="socialSupportSubjects && partnerOrganizations"
        :is-submitting="isSubmitting"
        :social-support-subjects="socialSupportSubjects"
        :beneficiary-id="beneficiaryId"
        :partner-organizations="partnerOrganizations"
        :is-financial="isFinancial"
        @save-help-request="onAddHelpRequest"
      />
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { FileInstructionType } from '@prisma/client'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { AlertType } from '~/utils/constants/alert'
  import { Breadcrumb, RouteTitle, RoutePath, Route } from '~/utils/routing'
  import { CreateHelpRequestInput } from '~/server/schema'
  import { toFirstLetterUpperCase } from '~/utils/toFirstLetterUpperCase'
  import { fileInstructionTypePictos } from '~/client/options'
  import { HistoryTab } from '~/utils/constants/history'

  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const route = useRoute()

  const isSubmitting = ref<boolean>(false)
  const formContainer = ref<HTMLElement | null>(null)

  const beneficiaryId = route.params.id as string
  const subject = toFirstLetterUpperCase(
    route.params.subject as string
  ) as FileInstructionType
  const isFinancial = subject === FileInstructionType.Financial
  const subtitle = isFinancial ? 'Aide financière' : undefined
  const subtitlePictoPath = isFinancial
    ? fileInstructionTypePictos.Financial
    : undefined

  const { data: beneficiary, error: beneficiaryError } =
    await trpcClient.beneficiary.getBeneficiaryMinimalInfo.useQuery({
      id: beneficiaryId
    })

  const title = computed(() =>
    RouteTitle.AppBeneficiaryHelpRequestAdd(beneficiary.value || null)
  )

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
    if (beneficiaryError.value) {
      return "Les informations du bénéficiaire n'ont pas pu être chargées."
    }
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
      onSuccess: async res => {
        const fullHelpRequest = await trpcClient.helpRequest.getOne.useQuery({
          id: res.helpRequest.id
        })
        const socialSupportId =
          fullHelpRequest.data.value?.helpRequest.fileInstruction.socialSupport
            .id

        if (socialSupportId) {
          navigateTo(
            RoutePath.AppBeneficiary(beneficiaryId, {
              item: socialSupportId,
              tab: BeneficiaryTab.History,
              originPage: Route.AppHistory,
              originTab: HistoryTab.FileInstructions
            })
          )
        } else {
          navigateTo(
            RoutePath.AppBeneficiary(beneficiaryId, {
              tab: BeneficiaryTab.History
            })
          )
        }
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
