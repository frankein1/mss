<template>
  <PageContainer>
    <DsfrBreadcrumb :links="Breadcrumb.AppBeneficiaryFollowupEdit(followup)" />
    <PageTitle :title="title" />
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
      <FollowupFormEdition
        v-else-if="followupData && followupTypes && prescribingOrganizations"
        :is-submitting="isSubmitting"
        :followup-types="followupTypes"
        :prescribing-organizations="prescribingOrganizations"
        :data="followupData"
        @save-followup="onUpdateFollowup"
      />
    </main>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { AlertType } from '~/utils/constants/alert'
  import { Breadcrumb, RoutePath, RouteTitle } from '~/utils/routing'
  import { EditFollowupInput } from '~/server/schema'

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

  const followup = computed(() => followupData.value?.followup || null)
  const beneficiary = computed(() => followup.value?.beneficiary || null)

  const title = computed(() =>
    RouteTitle.AppBeneficiaryFollowupEdit(beneficiary.value)
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

  const pending = computed(
    () =>
      followupPending.value ||
      followupTypesPending.value ||
      prescribingOrganizationsPending.value
  )

  const fetchError = computed(() => {
    if (followupError.value) {
      return "La synthèse de l'entretien n'a pas pu être chargée."
    }
    if (followupTypesError.value) {
      return "La liste des objets d'accompagnement de votre structure n'a pas pu être chargée."
    }
    if (prescribingOrganizationsError.value) {
      return "La liste des organismes prescripteurs de votre structure n'a pas pu être chargée."
    }
    return ''
  })

  function onUpdateFollowup(followup: EditFollowupInput) {
    useTrpcMutation({
      mutation: () => trpcClient.followup.update.mutate(followup),
      isSubmitting,
      onSuccess: () => {
        navigateTo(
          RoutePath.AppBeneficiary(followup.beneficiaryId, {
            tab: BeneficiaryTab.History
          })
        )
      },
      onFailure: () => {
        snackbar.error(
          'La mise à jour de la synthèse a échoué.',
          () => formContainer.value?.querySelector('input')?.focus()
        )
      }
    })
  }
</script>
