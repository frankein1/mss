<template>
  <div>
    <div class="fr-container">
      <WorkshopFormHeader
        :title="title"
        :breadcrumbs="breadcrumbs.workshop.AppWorkshopAdd()"
      />
    </div>
    <AtomLazyComponent
      :error="Boolean(errorPartner)"
      message="La page n'a pas pu être chargée."
    >
      <WorkshopForm
        v-if="partnerOrganizations"
        :is-submitting="status === 'pending'"
        :partner-organizations="partnerOrganizations"
        :caught-errors
        @submit="onSubmit"
        @cancel="onCancel"
      />
    </AtomLazyComponent>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { CreateWorkshopInput, createWorkshopSchema } from '~/server/schema'

  const title = routes.workshop.AppWorkshopAdd.title

  useHead({ title })

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()

  // Get partners organisations
  const { data: partnerOrganizations, error: errorPartner } =
    await trpcClient.partner.getAll.useQuery()

  // Form
  const { handleSubmit } = useForm<CreateWorkshopInput>({
    validationSchema: toTypedSchema(createWorkshopSchema)
  })

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      onCreateWorkshop(values)
    }
  )

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

  const onCancel = () => {
    useRouter().back()
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
