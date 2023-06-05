<template>
  <PageContainer>
    <PageTitle :title="title" />
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
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
  import { EditHelpRequestInput } from '~/server/schema/helpRequest.schema'
  import { getBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary-tabs'
  import { AlertType } from '~~/utils/constants/alert'
  import { Routes } from '~/utils/routing/routes'

  // FIXME: Missing permissions
  // definePageMeta({
  //   middleware: ['owns-help-request', 'is-beneficiary-referent']
  // })

  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const route = useRoute()

  const isSubmitting = ref<boolean>(false)
  const formContainer = ref<HTMLElement | null>(null)

  const helpRequestId = computed(() => route.params.hrid as string)

  const {
    data: helpRequest,
    pending: helpRequestPending,
    error: helpRequestError
  } = await trpcClient.helpRequest.getHelpRequestDetails.useQuery({
    id: helpRequestId.value
  })

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
      return "L'instruction de demande n'a pas pu être chargée."
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

  const title = computed(() => {
    if (!helpRequest.value) {
      return "Modifier l'instruction d'un·e bénéficiaire"
    }
    return `Modifier l'instruction de ${getBeneficiaryDisplayName(
      helpRequest.value.beneficiary
    )}`
  })

  const beneficiaryId = computed(() => route.params.id as string)

  async function onUpdateHelpRequest(helpRequest: EditHelpRequestInput) {
    isSubmitting.value = true
    try {
      await trpcClient.helpRequest.update.mutate(helpRequest)
      return navigateTo(
        Routes.Beneficiary(beneficiaryId.value, { tab: BeneficiaryTab.History })
      )
    } catch {
      snackbar.error("La mise à jour de l'instruction a échoué.", () =>
        formContainer.value?.querySelector('input')?.focus()
      )
    }
    isSubmitting.value = false
  }
</script>
