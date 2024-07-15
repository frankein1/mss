<template>
  <PageContainer class="page-container">
    <AtomBreadcrumb />
    <!-- <DsfrBreadcrumb :links="Breadcrumb.AppBeneficiariesAdd()" /> -->
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
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/routes'

  const title = routes.beneficiary.AppBeneficiariesAdd.title

  useHead({ title })

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  const matomo = useMatomo()

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
    draft: boolean
  ) {
    useTrpcMutation({
      mutation: () =>
        trpcClient.beneficiary.create.mutate({
          ...beneficiary,
          draft
        }),
      isSubmitting,
      onSuccess: ({ id }) => {
        matomo.trackEvent(
          EventCategory.CreateBeneficiary,
          CreateBeneficiaryEventAction.SavePartialForm
        )
        if (draft) {
          navigateTo(routes.beneficiary.AppBeneficiaryEditInfo.path(id))
        } else {
          navigateTo(routes.beneficiary.AppBeneficiary.path(id))
        }
      },
      onFailure: () => {
        snackbar.error('La création de la fiche bénéficiaire a échoué.')
      }
    })
  }
</script>

<style scoped>
  .page-container {
    padding-left: 10em;
    padding-right: 10em;
  }
</style>
