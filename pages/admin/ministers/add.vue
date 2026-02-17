<template>
  <PageContainer>
    <PageTitle
      class="fr-mt-4v"
      title="Ajouter un ministre"
    />
    <div
      class="fr-container fr-mt-6v fr-grid-row fr-grid-row--gutters fr-mt-3w"
    >
      <div class="fr-col-12">
        <div class="main-container fr-p-5w">
          <AdminMinisterForm
            :create="true"
            :minister="null"
            :is-submitting="isSubmitting"
            @create-minister="onCreateMinister($event as CreateMinisterInput)"
          />
        </div>
      </div>
    </div>
  </PageContainer>
</template>
<script lang="ts" setup>
  import type { CreateMinisterInput } from '~/server/schema'
  import { routes } from '~/utils/routes'
  const isSubmitting = ref(false)
  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const router = trpcClient.admin

  const { mutate, error: updateError } = router.createMinister.useMutation()

  const onCreateMinister = async (input: CreateMinisterInput) => {
    const minister = await mutate(input)
    if (updateError.value || minister === null) {
      snackbar.error('La création du ministre a échoué.')
      return
    }
    snackbar.success('Le ministre a été créé avec succès.')
    navigateTo(routes.admin.AdminMinisters.path())
  }
</script>
