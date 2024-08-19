<template>
  <PageContainer>
    <AtomBreadcrumb
      :links="
        breadcrumbs.followup.AppFileFollowupAdd(
          familyFileId,
          familyFileIdentification
        )
      "
    />

    <PageTitle
      :title="title"
      icon="fr-icon-questionnaire-fill"
      icon-variant="green"
    >
      <RequiredFields />
    </PageTitle>

    <main ref="formContainer">
      <AtomLazyComponent
        :pending
        :error="Boolean(fetchError)"
        :message="fetchError"
      >
        <FollowupFormCreation
          v-if="socialSupportSubjects && partnerOrganizations"
          :is-submitting="isSubmitting"
          :social-support-subjects="socialSupportSubjects"
          :family-file-id="familyFileId"
          :family-file-identification="familyFileIdentification || []"
          :beneficiary-id="getBeneficiaryIdOnPageLoad()"
          :partner-organizations="partnerOrganizations"
          @save-followup="onAddFollowup"
        />
      </AtomLazyComponent>
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { AddFollowupInput } from '~/server/schema'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const route = useRoute()

  const isSubmitting = ref<boolean>(false)
  const formContainer = ref<HTMLElement | null>(null)

  const familyFileId = route.params.id as string

  const { familyFileIdentification, getBeneficiaryIdOnPageLoad } =
    await useFamilyFileMinimalInfo(familyFileId)

  const title = computed(() => {
    if (
      familyFileIdentification &&
      familyFileIdentification.value?.length &&
      familyFileIdentification.value?.length === 1
    ) {
      return routes.followup.AppBeneficiaryFollowupAdd.title(
        familyFileIdentification.value[0]
      )
    }
    return routes.followup.AppBeneficiaryFollowupAdd.title(null)
  })

  useHead({ title })

  const {
    data: socialSupportSubjects,
    pending: socialSupportSubjectsPending,
    error: socialSupportSubjectsError
  } = await trpcClient.structure.getActiveSocialSupportSubjects.useQuery()

  const {
    data: partnerOrganizations,
    pending: partnerOrganizationsPending,
    error: partnerOrganizationsError
  } = await trpcClient.partner.getAll.useQuery()

  const pending = computed(
    () =>
      socialSupportSubjectsPending.value || partnerOrganizationsPending.value
  )

  const fetchError = computed(() => {
    if (socialSupportSubjectsError.value) {
      return "La liste des objets d'accompagnement de votre structure n'a pas pu être chargée."
    }
    if (partnerOrganizationsError.value) {
      return "La liste des organismes partenaires de votre structure n'a pas pu être chargée."
    }
    return ''
  })

  function onAddFollowup(followup: AddFollowupInput) {
    useTrpcMutation({
      mutation: () => trpcClient.followup.add.mutate(followup),
      isSubmitting,
      onSuccess: ({ fileInstruction }) => {
        navigateTo(
          routes.file.AppFile.path(followup.familyFileId, {
            beneficiaryId: followup.beneficiaryId,
            tab: BeneficiaryTab.History,
            item: fileInstruction?.socialSupportId
          })
        )
      },
      onFailure: () => {
        snackbar.error("La création de la synthèse d'entretien a échoué.", () =>
          formContainer.value?.querySelector('input')?.focus()
        )
      }
    })
  }
</script>
