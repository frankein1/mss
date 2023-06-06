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
          <HelpRequestFormCreation
            v-else-if="
              followupTypes &&
              prescribingOrganizations &&
              instructorOrganizations
            "
            :is-submitting="isSubmitting"
            :followup-types="followupTypes"
            :beneficiary-id="beneficiaryId"
            :prescribing-organizations="prescribingOrganizations"
            :instructor-organizations="instructorOrganizations"
            @save-help-request="onAddHelpRequest"
          />
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { getBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary-tabs'
  import { AlertType } from '~/utils/constants/alert'
  import { Routes } from '~/utils/routing/routes'
  import { CreateHelpRequestInput } from '~/server/schema/helpRequest.schema'

  // FIXME: Missing permissions
  // definePageMeta({
  //   middleware: ['is-beneficiary-referent', 'can-add-help-requests']
  // })

  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const route = useRoute()

  const isSubmitting = ref<boolean>(false)
  const formContainer = ref<HTMLElement | null>(null)

  const beneficiaryId = route.params.id as string
  const beneficiaryHistoryPath = Routes.Beneficiary(beneficiaryId, {
    tab: BeneficiaryTab.History
  })

  const { data: beneficiary, error: beneficiaryError } =
    await trpcClient.beneficiary.getBeneficiaryMinimalInfo.useQuery({
      id: beneficiaryId
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
      followupTypesPending.value ||
      prescribingOrganizationsPending.value ||
      instructorOrganizationsPending.value
  )

  const fetchError = computed(() => {
    if (beneficiaryError.value) {
      return "Les informations du bénéficiaire n'ont pas pu être chargées."
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
    if (!beneficiary.value) {
      return "Instruction d'une demande d'aide"
    }
    return `Instruction d'une demande d'aide pour ${getBeneficiaryDisplayName(
      beneficiary.value
    )}`
  })

  async function onAddHelpRequest(helpRequest: CreateHelpRequestInput) {
    isSubmitting.value = true
    try {
      await trpcClient.helpRequest.add.mutate(helpRequest)
      navigateTo(beneficiaryHistoryPath)
    } catch {
      snackbar.error(
        "La création de l'instruction de demande d'aide a échoué.",
        () => formContainer.value?.querySelector('input')?.focus()
      )
    }
    isSubmitting.value = false
  }
</script>
