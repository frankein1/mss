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
        />
      </div>
      <RequiredFields />
    </div>

    <AtomLazyComponent
      :pending
      :error="Boolean(error)"
      message="La page n'a pas pu être chargée."
    >
      <WorkshopCreationForm
        v-if="partnerOrganizations"
        :is-submitting="false"
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
  import { CreateWorkshopSchemaInput } from '~/server/schema'

  const title = routes.workshop.AppWorkshopAdd.title

  useHead({ title })

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()
  const isSubmitting = ref(false)

  // Get partners organisations
  const {
    data: partnerOrganizations,
    pending,
    error
  } = await trpcClient.partner.getAll.useQuery()

  const onCancel = () => {
    useRouter().back()
  }

  const onCreateWorkshop = async (input: CreateWorkshopSchemaInput) => {
    const router = trpcClient.worshop
    const createWorkshop = router.createWorkshop.useMutation()
    const errMessage = "La création de l'atelier a échoué."

    useTrpcMutation({
      isSubmitting,
      mutation: () => createWorkshop.mutate(input),
      onSuccess: workshopCreated => {
        if (createWorkshop.error.value || workshopCreated == null) {
          snackbar.error(errMessage, snackbar.focus('form', 'select'))
          return
        }
        const workshopRoute = routes.workshop.AppWorkshop.path(
          workshopCreated.id
        )
        navigateTo(workshopRoute)
      },
      onFailure: () => {
        snackbar.error(errMessage, snackbar.focus('form', 'select'))
      }
    })
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
