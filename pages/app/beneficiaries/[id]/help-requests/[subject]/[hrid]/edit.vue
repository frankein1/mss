<template>
  <PageContainer>
    <DsfrBreadcrumb
      :links="Breadcrumb.AppBeneficiaryHelpRequestEdit(helpRequest, subject)"
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
      <HelpRequestFormEdition
        v-else-if="
          helpRequestData &&
          followupTypes &&
          prescribingOrganizations &&
          instructorOrganizations
        "
        :is-submitting="isSubmitting"
        :followup-types="followupTypes"
        :data="helpRequestData"
        :prescribing-organizations="prescribingOrganizations"
        :instructor-organizations="instructorOrganizations"
        @save-help-request="onUpdateHelpRequest"
      />
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { EditHelpRequestInput } from '~/server/schema'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { AlertType } from '~~/utils/constants/alert'
  import { Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'
  import { helpRequestSubjectPictos } from '~/client/options/helpRequest'
  import { HelpRequestSubject } from '~/types/socialSupport'

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

  const beneficiary = computed(() => helpRequest.value?.beneficiary || null)

  const title = computed(() =>
    RouteTitle.AppBeneficiaryHelpRequestEdit(beneficiary.value)
  )

  const subject = computed(() =>
    helpRequest.value?.financialSupport
      ? HelpRequestSubject.Financial
      : HelpRequestSubject.Other
  )

  const subtitle = computed(() =>
    helpRequest.value?.financialSupport ? 'Aide financière' : undefined
  )

  const subtitlePictoPath = computed(() => {
    if (!helpRequest.value) {
      return undefined
    }
    return helpRequest.value?.financialSupport
      ? helpRequestSubjectPictos.Financial
      : undefined
  })

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
      return "La liste des objets d'accompagnement de votre structure n'a pas pu être chargée."
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
        snackbar.error("La mise à jour de l'instruction a échoué.", () =>
          formContainer.value?.querySelector('input')?.focus()
        )
      }
    })
  }
</script>
