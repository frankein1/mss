<template>
  <PageContainer>
    <!-- <DsfrBreadcrumb
      :links="Breadcrumb.AppBeneficiaryFollowupAdd(beneficiary)"
    /> -->
    <PageTitle
      :title="title"
      icon="fr-icon-questionnaire-fill"
      icon-variant="green"
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
      <FollowupFormCreation
        v-else-if="socialSupportSubjects && partnerOrganizations"
        :is-submitting="isSubmitting"
        :social-support-subjects="socialSupportSubjects"
        :beneficiary-id="beneficiaryId"
        :partner-organizations="partnerOrganizations"
        @save-followup="onAddFollowup"
      />
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath, RouteTitle } from '~/utils/routing'
  import { AddFollowupInput } from '~/server/schema'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'

  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const route = useRoute()

  const isSubmitting = ref<boolean>(false)
  const formContainer = ref<HTMLElement | null>(null)

  const beneficiaryId = route.params.id as string

  const { data: beneficiary, error: beneficiaryError } =
    await trpcClient.beneficiary.getBeneficiaryMinimalInfo.useQuery({
      id: beneficiaryId
    })

  const title = computed(() =>
    RouteTitle.AppBeneficiaryFollowupAdd(beneficiary.value || null)
  )

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
    if (beneficiaryError.value) {
      return "Les informations du bénéficiaire n'ont pas pu être chargées."
    }
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
      onSuccess: () => {
        navigateTo(
          RoutePath.AppBeneficiary(beneficiaryId, {
            tab: BeneficiaryTab.History
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
