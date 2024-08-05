<template>
  <PageContainer>
    <AtomBreadcrumb
      :links="
        breadcrumbs.followup.AppFileFollowupEdit(
          followup,
          familyFileIdentification
        )
      "
    />
    <PageTitle :title="title" />
    <main ref="formContainer">
      <AtomAlert
        v-if="fetchError"
        :alert-type="AlertType.Error"
        :message="fetchError"
      />

      <AtomLoader
        v-if="pending"
        class="fr-mx-auto"
      />
      <FollowupFormEdition
        v-else-if="
          followupData && socialSupportSubjects && partnerOrganizations
        "
        :is-submitting="isSubmitting"
        :social-support-subjects="socialSupportSubjects"
        :partner-organizations="partnerOrganizations"
        :data="followupData"
        :family-file-identification="familyFileIdentification || []"
        @save-followup="onUpdateFollowup"
      />
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { AlertType } from '~/utils/constants/alert'
  import { EditFollowupInput } from '~/server/schema'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const route = useRoute()
  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()

  const isSubmitting = ref<boolean>(false)
  const formContainer = ref<HTMLElement | null>(null)

  const followupId = route.params.fid as string

  const {
    data: followupData,
    pending: followupPending,
    error: followupError
  } = await trpcClient.followup.getOne.useQuery({
    id: followupId
  })

  const familyFileId = followupData.value?.followup.familyFileId || ''
  const { familyFileIdentification } =
    await useFamilyFileMinimalInfo(familyFileId)

  const followup = computed(() => followupData.value?.followup || null)
  const beneficiary = computed(() => followup.value?.beneficiary || null)

  const title = computed(() =>
    routes.followup.AppBeneficiaryFollowupEdit.title(beneficiary.value)
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
      followupPending.value ||
      socialSupportSubjectsPending.value ||
      partnerOrganizationsPending.value
  )

  const fetchError = computed(() => {
    if (followupError.value) {
      return "La synthèse de l'entretien n'a pas pu être chargée."
    }
    if (socialSupportSubjectsError.value) {
      return "La liste des objets d'accompagnement de votre structure n'a pas pu être chargée."
    }
    if (partnerOrganizationsError.value) {
      return "La liste des organismes partenaires de votre structure n'a pas pu être chargée."
    }
    return ''
  })

  function onUpdateFollowup(followup: EditFollowupInput) {
    useTrpcMutation({
      mutation: () => trpcClient.followup.update.mutate(followup),
      isSubmitting,
      onSuccess: () => {
        navigateTo(
          routes.beneficiary.AppBeneficiary.path(followup.beneficiaryId, {
            tab: BeneficiaryTab.History
          })
        )
      },
      onFailure: () => {
        snackbar.error('La mise à jour de la synthèse a échoué.', () =>
          formContainer.value?.querySelector('input')?.focus()
        )
      }
    })
  }
</script>
