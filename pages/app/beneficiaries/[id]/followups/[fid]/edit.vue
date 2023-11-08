<template>
  <PageContainer>
    <DsfrBreadcrumb :links="Breadcrumb.AppBeneficiaryFollowupEdit(followup)" />
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
          <FollowupFormEdition
            v-else-if="
              followup &&
              followupTypes &&
              prescribingOrganizations &&
              permissions
            "
            :permissions="permissions"
            :is-submitting="isSubmitting"
            :followup-types="followupTypes"
            :prescribing-organizations="prescribingOrganizations"
            :followup="followup"
            @save-followup="onUpdateFollowup"
          />
        </main>
      </div>
    </div>
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

  const beneficiaryId = route.params.id as string
  const followupId = route.params.fid as string

  const {
    data: followup,
    pending: followupPending,
    error: followupError
  } = await trpcClient.followup.getFollowupDetails.useQuery({
    id: followupId
  })

  const { data: permissions, error: permissionsError } =
    await trpcClient.permissions.getFollowupPermissions.useQuery({
      beneficiaryId,
      targetId: followupId
    })

  const beneficiary = computed(() => followup.value?.beneficiary || null)

  const title = computed(() =>
    RouteTitle.AppBeneficiaryFollowupEdit(beneficiary.value)
  )

  useHead({ title })

  const {
    data: followupTypes,
    pending: followupTypesPending,
    error: followupTypesError
  } = await trpcClient.config.getStructureFollowupTypes.useQuery({
    id: followupId
  })

  const {
    data: prescribingOrganizations,
    pending: prescribingOrganizationsPending,
    error: prescribingOrganizationsError
  } = await trpcClient.config.getPrescribingOrganizations.useQuery({})

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
      return "La liste des types d'accompagnement de votre structure n'a pas pu être chargée."
    }
    if (prescribingOrganizationsError.value) {
      return "La liste des organismes prescripteurs de votre structure n'a pas pu être chargée."
    }
    if (permissionsError.value) {
      return "Les permissions n'ont pas pu être chargées."
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
