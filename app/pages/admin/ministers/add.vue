<template>
  <PageContainer class="fr-p-5w">
    <PageTitle :title="routes.admin.AdminMinisterAdd.title" />

    <div class="fr-grid-row fr-grid-row--gutters">
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
  import type { CreateMinisterInput } from '~~/server/schema'
  import { routes } from '~/utils/routes'
  const isSubmitting = ref(false)
  const snackbar = useSnackbar()
  const trpcClient = useTrpcClient()
  const router = trpcClient.admin

  const { mutate, error: updateError } = router.createMinister.useMutation()

  const onCreateMinister = async (input: CreateMinisterInput) => {
    const minister = await mutate(input)
    if (updateError.value || !minister) {
      snackbar.error('La création du ministre a échoué.')
      return
    }
    snackbar.success('Le ministre a été créé avec succès.')
    navigateTo(routes.admin.AdminMinisters.path())
  }
</script>
