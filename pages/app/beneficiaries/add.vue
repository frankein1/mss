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
      v-if="error"
      class="fr-mb-2w"
      :alert-type="AlertType.Error"
      message="La liste des référents n'a pas pu être chargée."
    />
    <AtomLoader
      v-else-if="pending"
      class="fr-mx-auto"
    />
    <BeneficiaryCreationForm
      v-else-if="agents?.length"
      :agents="agents"
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
  } = await trpcClient.config.getAgents.useQuery({})

  const isSubmitting = ref(false)

  async function onCreateBeneficiary(
    beneficiary: CreateBeneficiaryInput,
    complete: boolean
  ) {
    isSubmitting.value = true

    if (complete) {
      try {
        const { id } =
          await trpcClient.beneficiaryDraft.create.mutate(beneficiary)

        navigateTo(RoutePath.AppBeneficiariesSaveInfo(id))
      } catch {
        snackbar.error(
          'La création du brouillon de la fiche bénéficiaire a échoué.'
        )
      } finally {
        isSubmitting.value = false
      }
    } else {
      try {
        const { id } = await trpcClient.beneficiary.create.mutate(beneficiary)
        matomo.trackEvent(
          EventCategory.CreateBeneficiary,
          CreateBeneficiaryEventAction.SavePartialForm
        )
        navigateTo(RoutePath.AppBeneficiary(id))
      } catch {
        snackbar.error('La création de la fiche bénéficiaire a échoué.')
      } finally {
        isSubmitting.value = false
      }
    }
  }
</script>

<style>
  .page-container {
    padding-left: 10em;
    padding-right: 10em;
  }
</style>
