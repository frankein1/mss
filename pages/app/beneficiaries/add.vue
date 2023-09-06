<template>
  <PageContainer class="page-container">
    <DsfrBreadcrumb :links="Breadcrumb.AppBeneficiariesAdd()" />
    <PageTitle
      :title="title"
      icon="fr-icon-user-add-line"
    >
      <RequiredFields />
    </PageTitle>
    <BeneficiaryCreationForm
      v-if="agents?.length"
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

  const title = RouteTitle.AppBeneficiariesAdd()

  useHead({ title })

  const trpcClient = useTrpcClient()

  const { matomo } = useMatomo()

  const { data: agents } = await trpcClient.config.getAgents.useQuery()

  const isSubmitting = ref(false)

  async function onCreateBeneficiary(
    beneficiary: CreateBeneficiaryInput,
    complete: boolean
  ) {
    isSubmitting.value = true
    if (complete) {
      navigateTo({
        path: RoutePath.AppBeneficiariesSave(),
        query: {
          initialValues: JSON.stringify(beneficiary)
        }
      })
    } else {
      // TODO: handle error
      const { id } = await trpcClient.beneficiary.create.mutate(beneficiary)
      matomo.trackEvent(
        EventCategory.CreateBeneficiary,
        CreateBeneficiaryEventAction.SavePartialForm
      )
      navigateTo(RoutePath.AppBeneficiary(id))
    }
    isSubmitting.value = false
  }
</script>

<style>
  .page-container {
    padding-left: 10em;
    padding-right: 10em;
  }
</style>
