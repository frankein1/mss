<template>
  <div>
    <div class="fr-container">
      <AtomBreadcrumb :links="breadcrumbs.workshop.AppWorkshopAdd()" />
      <div class="page-title-container fr-mb-4w">
        <div class="page-title-image">
          <img
            src="/pictograms/calendar.svg"
            alt=""
          />
        </div>
        <PageTitle
          :title="title"
          no-margin
        >
        </PageTitle>
      </div>
      <RequiredFields />
    </div>

    <AtomLazyComponent
      :error="Boolean(errorPartner)"
      message="La page n'a pas pu être chargée."
    >
      <WorkshopCreationForm
        v-if="partnerOrganizations"
        :is-submitting="status === 'pending'"
        :partner-organizations="partnerOrganizations"
        @save-workshop="onCreateWorkshop"
        @cancel="onCancel"
      />
    </AtomLazyComponent>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { CreateWorkshopInput } from '~/server/schema'

  const title = routes.workshop.AppWorkshopAdd.title

  useHead({ title })

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  // Get partners organisations
  const { data: partnerOrganizations, error: errorPartner } =
    await trpcClient.partner.getAll.useQuery()

  const onCancel = () => {
    useRouter().back()
  }

  const router = trpcClient.workshop
  const { mutate, error, status } = router.createWorkshop.useMutation()

  const onCreateWorkshop = async (input: CreateWorkshopInput) => {
    const workshopCreated = await mutate(input)

    if (error.value || workshopCreated === null) {
      snackbar.error(
        "La création de l'atelier a échoué.",
        snackbar.focus('form', 'select')
      )
      return
    }
    const workshopRoute = routes.workshop.AppWorkshop.path(workshopCreated.id)
    navigateTo(workshopRoute)
  }
</script>

<style scoped lang="scss">
  .fr-container {
    max-width: 58rem;
  }

  .page-title-container {
    display: flex;
    align-items: center;

    .page-title-image {
      border-radius: 0.5rem;
      background-color: #fff;
      margin-right: 1rem;
      width: 6rem;
      height: 6rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
