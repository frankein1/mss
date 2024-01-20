<template>
  <PageContainer>
    <DsfrBreadcrumb
      :links="Breadcrumb.AppBeneficiaryHelpRequestEdit(helpRequest, 'Housing')"
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
        v-if="fetchError"
        :alert-type="AlertType.Error"
        :message="fetchError"
      />

      <AtomLoader
        v-if="pending"
        class="fr-mx-auto"
      />
      <HousingHelpRequestFormEdition
        v-else-if="helpRequestData && instructorOrganizations"
        :is-submitting="isSubmitting"
        :data="helpRequestData"
        :instructor-organizations="instructorOrganizations"
        @save-help-request="onUpdateHelpRequest"
      />
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { EditHousingHelpRequestInput } from '~/server/schema'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { AlertType } from '~~/utils/constants/alert'
  import { Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'
  import { helpRequestSubjectPictos } from '~/client/options/helpRequest'

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
  } = await trpcClient.housingHelpRequest.getOne.useQuery({
    id: helpRequestId
  })

  const helpRequest = computed(() => helpRequestData.value?.helpRequest || null)

  const beneficiary = computed(() => helpRequest.value?.beneficiary || null)

  const title = computed(() =>
    RouteTitle.AppBeneficiaryHelpRequestEdit(beneficiary.value)
  )

  useHead({ title })

  const {
    data: instructorOrganizations,
    pending: instructorOrganizationsPending,
    error: instructorOrganizationsError
  } = await trpcClient.config.getInstructorOrganization.useQuery()

  const pending = computed(
    () => helpRequestPending.value || instructorOrganizationsPending.value
  )

  const fetchError = computed(() => {
    if (helpRequestError.value) {
      return "L'instruction de dossier n'a pas pu être chargée."
    }
    if (instructorOrganizationsError.value) {
      return "La liste des organismes instructeurs de votre structure n'a pas pu être chargée."
    }
    return ''
  })

  function onUpdateHelpRequest(helpRequest: EditHousingHelpRequestInput) {
    useTrpcMutation({
      mutation: () => trpcClient.housingHelpRequest.update.mutate(helpRequest),
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
          "La mise à jour de l'instruction a échoué.",
          () => formContainer.value?.querySelector('input')?.focus()
        )
      }
    })
  }
</script>
