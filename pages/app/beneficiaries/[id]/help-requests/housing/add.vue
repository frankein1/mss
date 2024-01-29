<template>
  <PageContainer>
    <DsfrBreadcrumb
      :links="
        Breadcrumb.AppBeneficiaryHelpRequestAdd(
          beneficiary,
          HelpRequestSubject.Housing
        )
      "
    />
    <PageTitle
      :title="title"
      icon="fr-icon-questionnaire-fill"
      icon-color-class="color-purple-glycine"
      icon-background-class="bg-purple-glycine"
      subtitle="Demande de logement"
      :subtitle-picto-path="helpRequestSubjectPictos.Housing"
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
        v-else-if="instructorOrganizations"
        :is-submitting="isSubmitting"
        :beneficiary-id="beneficiaryId"
        :instructor-organizations="instructorOrganizations"
        @save-housing-help-request="onAddHousingHelpRequest"
      />
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { AlertType } from '~/utils/constants/alert'
  import { Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'
  import { CreateHousingHelpRequestInput } from '~/server/schema'
  import { helpRequestSubjectPictos } from '~/client/options/helpRequest'
  import { HelpRequestSubject } from '~/types/socialSupport'

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
    data: instructorOrganizations,
    pending,
    error
  } = await trpcClient.config.getInstructorOrganization.useQuery()

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
