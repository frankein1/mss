<template>
  <PageContainer>
    <DsfrBreadcrumb
      :links="
        Breadcrumb.AppBeneficiaryHelpRequestAdd(
          beneficiary,
          FileInstructionType.Housing
        )
      "
    />
    <PageTitle
      :title="title"
      icon="fr-icon-questionnaire-fill"
      icon-color-class="color-purple-glycine"
      icon-background-class="bg-purple-glycine"
      subtitle="Demande de logement"
      :subtitle-picto-path="fileInstructionTypePictos.Housing"
    >
      <RequiredFields />
    </PageTitle>
    <main
      ref="formContainer"
      class="feature-section"
    >
      <AtomAlert
        v-if="error"
        :alert-type="AlertType.Error"
        message="La liste des organismes instructeurs de votre structure n'a pas pu être chargée."
      />

      <AtomLoader
        v-if="pending"
        class="fr-mx-auto"
      />
      <HousingHelpRequestFormCreation
        :is-submitting="isSubmitting"
        :beneficiary-id="beneficiaryId"
        :partner-organizations="partnerOrganizations || []"
        @save-housing-help-request="onAddHousingHelpRequest"
      />
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { FileInstructionType } from '@prisma/client'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { AlertType } from '~/utils/constants/alert'
  import { Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'
  import { CreateHousingHelpRequestInput } from '~/server/schema'
  import { fileInstructionTypePictos } from '~/client/options'

  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const route = useRoute()

  const isSubmitting = ref<boolean>(false)
  const formContainer = ref<HTMLElement | null>(null)

  const beneficiaryId = route.params.id as string

  const { data: beneficiary } =
    await trpcClient.beneficiary.getBeneficiaryMinimalInfo.useQuery({
      id: beneficiaryId
    })

  const title = computed(() =>
    RouteTitle.AppBeneficiaryHelpRequestAdd(beneficiary.value || null)
  )

  useHead({ title })

  const {
    data: partnerOrganizations,
    pending,
    error
  } = await trpcClient.config.getPartnerOrganizations.useQuery()

  function onAddHousingHelpRequest(
    housingHelpRequest: CreateHousingHelpRequestInput
  ) {
    useTrpcMutation({
      mutation: () =>
        trpcClient.housingHelpRequest.add.mutate(housingHelpRequest),
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
