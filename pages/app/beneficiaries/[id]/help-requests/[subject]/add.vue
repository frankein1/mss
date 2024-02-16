<template>
  <PageContainer>
    <DsfrBreadcrumb
      :links="Breadcrumb.AppBeneficiaryHelpRequestAdd(beneficiary, subject)"
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
      class="feature-section"
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
        v-else-if="followupTypes && partnerOrganizations"
        :is-submitting="isSubmitting"
        :followup-types="followupTypes"
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
  import { Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'
  import { CreateHelpRequestInput } from '~/server/schema'
  import { toFirstLetterUpperCase } from '~/utils/toFirstLetterUpperCase'
  import { fileInstructionTypePictos } from '~/client/options'

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
    data: followupTypes,
    pending: followupTypesPending,
    error: followupTypesError
  } = await trpcClient.config.getStructureFollowupTypes.useQuery()

  const {
    data: partnerOrganizations,
    pending: partnerOrganizationsPending,
    error: partnerOrganizationsError
  } = await trpcClient.config.getPartnerOrganizations.useQuery()

  const pending = computed(
    () => followupTypesPending.value || partnerOrganizationsPending.value
  )

  const fetchError = computed(() => {
    if (beneficiaryError.value) {
      return "Les informations du bénéficiaire n'ont pas pu être chargées."
    }
    if (followupTypesError.value) {
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
          RoutePath.AppBeneficiary(beneficiaryId, {
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
