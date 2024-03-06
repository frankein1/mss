<template>
  <PageContainer>
    <DsfrBreadcrumb
      v-if="housingHelpRequest"
      :links="
        Breadcrumb.AppBeneficiaryHelpRequestEdit(
          {
            id: housingHelpRequest?.id,
            beneficiary:
              housingHelpRequest?.fileInstruction.socialSupport.beneficiary
          },
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
      <HousingHelpRequestFormEdition
        v-else-if="housingHelpRequestData && partnerOrganizations"
        :is-submitting="isSubmitting"
        :data="housingHelpRequestData"
        :partner-organizations="partnerOrganizations"
        @save-housing-help-request="onUpdateHousingHelpRequest"
      />
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { FileInstructionType } from '@prisma/client'
  import { EditHousingHelpRequestInput } from '~/server/schema'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { AlertType } from '~/utils/constants/alert'
  import { Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'
  import { fileInstructionTypePictos } from '~/client/options'

  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const route = useRoute()

  const isSubmitting = ref<boolean>(false)
  const formContainer = ref<HTMLElement | null>(null)

  const housingHelpRequestId = route.params.hrid as string
  const beneficiaryId = route.params.id as string

  const {
    data: housingHelpRequestData,
    pending: housingHelpRequestPending,
    error: housingHelpRequestError
  } = await trpcClient.housingHelpRequest.getOne.useQuery({
    id: housingHelpRequestId
  })

  const housingHelpRequest = computed(
    () => housingHelpRequestData.value?.housingHelpRequest || null
  )

  const beneficiary = computed(
    () =>
      housingHelpRequest.value?.fileInstruction.socialSupport.beneficiary ||
      null
  )

  const title = computed(() =>
    RouteTitle.AppBeneficiaryHelpRequestEdit(beneficiary.value)
  )

  useHead({ title })

  const {
    data: partnerOrganizations,
    pending: partnerOrganizationsPending,
    error: partnerOrganizationsError
  } = await trpcClient.partner.getAll.useQuery()

  const pending = computed(
    () => housingHelpRequestPending.value || partnerOrganizationsPending.value
  )

  const fetchError = computed(() => {
    if (housingHelpRequestError.value) {
      return "L'instruction de dossier n'a pas pu être chargée."
    }
    if (partnerOrganizationsError.value) {
      return "La liste des organismes instructeurs de votre structure n'a pas pu être chargée."
    }
    return ''
  })

  function onUpdateHousingHelpRequest(
    housingHelpRequest: EditHousingHelpRequestInput
  ) {
    useTrpcMutation({
      mutation: () =>
        trpcClient.housingHelpRequest.update.mutate(housingHelpRequest),
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
          "La mise à jour de l'instruction de dossier a échoué.",
          () => formContainer.value?.querySelector('input')?.focus()
        )
      }
    })
  }
</script>
