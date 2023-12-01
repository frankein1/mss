<template>
  <PageContainer>
    <DsfrBreadcrumb
      :links="Breadcrumb.AppBeneficiaryHelpRequestEdit(helpRequest)"
    />
    <PageTitle :title="title" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <main
          ref="formContainer"
          class="main-container fr-p-5w"
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
              helpRequest &&
              followupTypes &&
              prescribingOrganizations &&
              instructorOrganizations
            "
            :is-submitting="isSubmitting"
            :followup-types="followupTypes"
            :help-request="helpRequest"
            :prescribing-organizations="prescribingOrganizations"
            :instructor-organizations="instructorOrganizations"
            @save-help-request="onUpdateHelpRequest"
          />
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { EditHelpRequestInput } from '~/server/schema'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { AlertType } from '~~/utils/constants/alert'
  import { Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'

  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const route = useRoute()

  const isSubmitting = ref<boolean>(false)
  const formContainer = ref<HTMLElement | null>(null)

  const helpRequestId = route.params.hrid as string
  const beneficiaryId = route.params.id as string

  const {
    data: helpRequest,
    pending: helpRequestPending,
    error: helpRequestError
  } = await trpcClient.helpRequest.getHelpRequestDetails.useQuery({
    id: helpRequestId
  })

  const beneficiary = computed(() => helpRequest.value?.beneficiary || null)

  const title = computed(() =>
    RouteTitle.AppBeneficiaryHelpRequestEdit(beneficiary.value)
  )

  useHead({ title })

  const {
    data: followupTypes,
    pending: followupTypesPending,
    error: followupTypesError
  } = await trpcClient.config.getStructureFollowupTypes.useQuery()

  const {
    data: prescribingOrganizations,
    pending: prescribingOrganizationsPending,
    error: prescribingOrganizationsError
  } = await trpcClient.config.getPrescribingOrganizations.useQuery()

  const {
    data: instructorOrganizations,
    pending: instructorOrganizationsPending,
    error: instructorOrganizationsError
  } = await trpcClient.config.getInstructorOrganization.useQuery()

  const pending = computed(
    () =>
      helpRequestPending.value ||
      followupTypesPending.value ||
      prescribingOrganizationsPending.value ||
      instructorOrganizationsPending.value
  )

  const fetchError = computed(() => {
    if (helpRequestError.value) {
      return "L'instruction de dossier n'a pas pu être chargée."
    }
    if (followupTypesError.value) {
      return "La liste des types d'accompagnement de votre structure n'a pas pu être chargée."
    }
    if (prescribingOrganizationsError.value) {
      return "La liste des organismes prescripteurs de votre structure n'a pas pu être chargée."
    }
    if (instructorOrganizationsError.value) {
      return "La liste des organismes instructeurs de votre structure n'a pas pu être chargée."
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
        snackbar.error(
          "La mise à jour de l'instruction a échoué.",
          () => formContainer.value?.querySelector('input')?.focus()
        )
      }
    })
  }
</script>
