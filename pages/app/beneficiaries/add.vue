<template>
  <PageContainer class="page-container">
    <DsfrBreadcrumb :links="Breadcrumb.AppBeneficiariesAdd()" />
    <PageTitle
      :title="title"
      icon="fr-icon-user-add-line"
    >
      <RequiredFields />
    </PageTitle>
    <AtomAlert
      v-if="error || permissionsError"
      class="fr-mb-2w"
      :alert-type="AlertType.Error"
      message="La liste des référents n'a pas pu être chargée."
    />
    <AtomLoader
      v-else-if="pending || permissionsPending"
      class="fr-mx-auto"
    />
    <BeneficiaryCreationForm
      v-else-if="agents?.length && permissions"
      :agents="agents"
      :permissions="permissions"
      :is-submitting="isSubmitting"
      @save-beneficiary="onCreateBeneficiary"
    />
  </PageContainer>
</template>

<script setup lang="ts">
  import { CreateBeneficiaryEventAction, EventCategory } from '~/types/matomo'
  import { CreateBeneficiaryInput } from '~/server/schema'
  import { RoutePath, Breadcrumb, RouteTitle } from '~/utils/routing'
  import { AlertType } from '~/utils/constants/alert'

  const title = RouteTitle.AppBeneficiariesAdd()

  useHead({ title })

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const { matomo } = useMatomo()

  const {
    data: agents,
    pending,
    error
  } = await trpcClient.config.getAgents.useQuery()

  const {
    data: permissions,
    pending: permissionsPending,
    error: permissionsError
  } = await trpcClient.permissions.getBeneficiaryCreationPermissions.useQuery()

  const isSubmitting = ref(false)

  function onCreateBeneficiary(
    beneficiary: CreateBeneficiaryInput,
    complete: boolean
  ) {
    if (complete) {
      useTrpcMutation({
        mutation: () => trpcClient.beneficiaryDraft.create.mutate(beneficiary),
        isSubmitting,
        onSuccess: ({ id }) => {
          navigateTo(RoutePath.AppBeneficiariesSaveInfo(id))
        },
        onFailure: () => {
          snackbar.error(
            'La création du brouillon de la fiche bénéficiaire a échoué.'
          )
        }
      })
    } else {
      useTrpcMutation({
        mutation: () => trpcClient.beneficiary.create.mutate(beneficiary),
        isSubmitting,
        onSuccess: ({ id }) => {
          matomo.value.trackEvent(
            EventCategory.CreateBeneficiary,
            CreateBeneficiaryEventAction.SavePartialForm
          )
          navigateTo(RoutePath.AppBeneficiary(id))
        },
        onFailure: () => {
          snackbar.error('La création de la fiche bénéficiaire a échoué.')
        }
      })
    }
  }
</script>

<style scoped>
  .page-container {
    padding-left: 10em;
    padding-right: 10em;
  }
</style>
