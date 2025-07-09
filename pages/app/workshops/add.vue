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
          class="title"
          :title="title"
          no-margin
        >
        </PageTitle>
        <RequiredFields class="required" />
      </div>
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
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: repeat(2, auto);
    grid-gap: 1rem;

    .page-title-image {
      grid-area: 1 / 1 / 3 / 2;
      border-radius: 0.5rem;
      background-color: #fff;
      width: 6rem;
      height: 6rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title {
      grid-area: 1 / 2 / 2 / 3;
    }

    .required {
      grid-area: 2 / 2 / 3 / 3;
    }
  }
</style>
