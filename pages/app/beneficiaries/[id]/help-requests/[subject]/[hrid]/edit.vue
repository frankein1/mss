<template>
  <PageContainer>
    <DsfrBreadcrumb
      v-if="helpRequest"
      :links="
        Breadcrumb.AppBeneficiaryHelpRequestEdit(
          {
            id: helpRequest.id,
            beneficiary: helpRequest.fileInstruction.socialSupport.beneficiary
          },
          subject
        )
      "
    />
    <PageTitle
      :title="title"
      icon="fr-icon-questionnaire-fill"
      icon-color-class="color-purple-glycine"
      icon-background-class="bg-purple-glycine"
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
      <HelpRequestFormEdition
        v-else-if="
          helpRequestData && socialSupportSubjects && partnerOrganizations
        "
        :is-submitting="isSubmitting"
        :social-support-subjects="socialSupportSubjects"
        :data="helpRequestData"
        :partner-organizations="partnerOrganizations"
        @save-help-request="onUpdateHelpRequest"
      />
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { FileInstructionType } from '@prisma/client'
  import { EditHelpRequestInput } from '~/server/schema'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { AlertType } from '~/utils/constants/alert'
  import { Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'
  import { fileInstructionTypePictos } from '~/client/options'

  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const route = useRoute()

  const isSubmitting = ref<boolean>(false)
  const formContainer = ref<HTMLElement | null>(null)

  const helpRequestId = route.params.hrid as string
  const beneficiaryId = route.params.id as string

  const {
    data: helpRequestData,
    pending: helpRequestPending,
    error: helpRequestError
  } = await trpcClient.helpRequest.getOne.useQuery({
    id: helpRequestId
  })

  const helpRequest = computed(() => helpRequestData.value?.helpRequest || null)

  const beneficiary = computed(
    () => helpRequest.value?.fileInstruction.socialSupport.beneficiary || null
  )

  const title = computed(() =>
    RouteTitle.AppBeneficiaryHelpRequestEdit(beneficiary.value)
  )

  const subject = computed(() =>
    helpRequest.value?.financialSupport
      ? FileInstructionType.Financial
      : FileInstructionType.Other
  )

  const subtitle = computed(() =>
    helpRequest.value?.financialSupport ? 'Aide financière' : undefined
  )

  const subtitlePictoPath = computed(() => {
    if (!helpRequest.value) {
      return undefined
    }
    return helpRequest.value?.financialSupport
      ? fileInstructionTypePictos.Financial
      : undefined
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
      helpRequestPending.value ||
      socialSupportSubjectsPending.value ||
      partnerOrganizationsPending.value
  )

  const fetchError = computed(() => {
    if (helpRequestError.value) {
      return "L'instruction de dossier n'a pas pu être chargée."
    }
    if (socialSupportSubjectsError.value) {
      return "La liste des objets d'accompagnement de votre structure n'a pas pu être chargée."
    }
    if (partnerOrganizationsError.value) {
      return "La liste des organismes partenaires de votre structure n'a pas pu être chargée."
    }
    return ''
  })

  function onUpdateHelpRequest(helpRequest: EditHelpRequestInput) {
    useTrpcMutation({
      mutation: () => trpcClient.helpRequest.update.mutate(helpRequest),
      isSubmitting,
      onSuccess: () => {
        navigateTo(
          RoutePath.AppBeneficiary(beneficiaryId, {
            tab: BeneficiaryTab.History
          })
        )
      },
      onFailure: () => {
        snackbar.error("La mise à jour de l'instruction a échoué.", () =>
          formContainer.value?.querySelector('input')?.focus()
        )
      }
    })
  }
</script>
