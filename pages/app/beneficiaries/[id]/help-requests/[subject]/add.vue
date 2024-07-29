<template>
  <PageContainer>
    <AtomBreadcrumb
      :links="
        breadcrumbs.helpRequest.AppBeneficiaryHelpRequestAdd(
          beneficiary,
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
        v-else-if="socialSupportSubjects && partnerOrganizations && beneficiary"
        :is-submitting="isSubmitting"
        :social-support-subjects="socialSupportSubjects"
        :family-file-id="beneficiary.familyFileId"
        :family-file-identification="familyFileIdentification || []"
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
    routes.helpRequest.AppBeneficiaryHelpRequestAdd.title(
      beneficiary.value || null
    )
  )

  useHead({ title })

  const familyFileId = beneficiary.value?.familyFileId || ''
  const { familyFileIdentification } =
    await useFamilyFileMinimalInfo(familyFileId)

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
      onSuccess: () => {
        navigateTo(
          routes.beneficiary.AppBeneficiary.path(beneficiaryId, {
            tab: BeneficiaryTab.History
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
