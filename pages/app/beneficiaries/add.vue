<template>
  <PageContainer class="page-container">
    <DsfrBreadcrumb :links="Breadcrumb.AppBeneficiariesAdd()" />
    <PageTitle :title="title">
      <div>
        Les champs avec <span class="color-red">*</span> sont obligatoires
      </div>
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
  import { useAuthStore } from '~/store/auth'
  import { CreateBeneficiaryInput } from '~/server/schema'
  import { RoutePath, Breadcrumb, RouteTitle } from '~/utils/routing'

  const title = RouteTitle.AppBeneficiariesAdd()

  useHead({ title })

  const trpcClient = useTrpcClient()
  const authStore = useAuthStore()

  const { data: agents } = await trpcClient.config.getAgents.useQuery()

  const isSubmitting = ref(false)

  async function onCreateBeneficiary(
    beneficiary: CreateBeneficiaryInput,
    complete: boolean
  ) {
    isSubmitting.value = true
    // TODO: handle error
    const { id } = await trpcClient.beneficiary.create.mutate(beneficiary)
    isSubmitting.value = false

    if (complete) {
      navigateTo(RoutePath.AppBeneficiaryEdit(authStore.userRole, id, true))
    } else {
      navigateTo(RoutePath.AppBeneficiary(id))
    }
  }
</script>

<style>
  .page-container {
    padding-left: 10em;
    padding-right: 10em;
  }
</style>
