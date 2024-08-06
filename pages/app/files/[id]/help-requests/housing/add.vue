<template>
  <PageContainer>
    <AtomBreadcrumb
      :links="
        breadcrumbs.helpRequest.AppFileHelpRequestAdd(
          familyFileId,
          familyFileIdentification,
          FileInstructionType.Housing
        )
      "
    />

    <PageTitle
      :title="title"
      icon="fr-icon-questionnaire-fill"
      icon-variant="purple"
      subtitle="Demande de logement"
      :subtitle-picto-path="fileInstructionTypePictos.Housing"
    >
      <RequiredFields />
    </PageTitle>
    <main ref="formContainer">
      <AtomLazyComponent
        :pending
        :error="Boolean(error)"
        message="La liste des organismes instructeurs de votre structure n'a pas pu être chargée."
      >
        <HousingHelpRequestFormCreation
          :beneficiary-id="getBeneficiaryIdOnPageLoad()"
          :is-submitting="isSubmitting"
          :family-file-id="familyFileId"
          :family-file-identification="familyFileIdentification || []"
          :partner-organizations="partnerOrganizations || []"
          @save-housing-help-request="onAddHousingHelpRequest"
        />
      </AtomLazyComponent>
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { FileInstructionType } from '@prisma/client'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { CreateHousingHelpRequestInput } from '~/server/schema'
  import { fileInstructionTypePictos } from '~/client/options'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const route = useRoute()

  const isSubmitting = ref<boolean>(false)
  const formContainer = ref<HTMLElement | null>(null)

  const familyFileId = route.params.id as string

  const title = computed(() =>
    routes.helpRequest.AppBeneficiaryHelpRequestAdd.title(null)
  )

  useHead({ title })

  const { familyFileIdentification, getBeneficiaryIdOnPageLoad } =
    await useFamilyFileMinimalInfo(familyFileId)

  const {
    data: partnerOrganizations,
    pending,
    error
  } = await trpcClient.partner.getAll.useQuery()

  function onAddHousingHelpRequest(
    housingHelpRequest: CreateHousingHelpRequestInput
  ) {
    useTrpcMutation({
      mutation: () =>
        trpcClient.housingHelpRequest.add.mutate(housingHelpRequest),
      isSubmitting,
      onSuccess: ({ socialSupportId }) => {
        navigateTo(
          routes.file.AppFile.path(housingHelpRequest.familyFileId, {
            beneficiaryId: housingHelpRequest.beneficiaryId,
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
