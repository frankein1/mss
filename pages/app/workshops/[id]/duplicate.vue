<template>
  <div>
    <div class="fr-container">
      <WorkshopFormHeader
        v-if="workshop"
        title="Dupliquer un atelier"
        :breadcrumbs="breadcrumbs.workshop.AppWorkshopDuplicate(workshop)"
      />
    </div>
    <AtomLazyComponent
      :error="Boolean(fetchError)"
      :message="fetchError"
    >
      <WorkshopForm
        v-if="workshop"
        :is-submitting="status === 'pending'"
        :caught-errors
        mode="duplicate"
        @submit="onSubmit"
        @cancel="onCancel"
      />
    </AtomLazyComponent>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import type { CreateWorkshopInput } from '~/server/schema'
  import { createWorkshopSchema } from '~/server/schema'
  import { EventCategory, WorkshopAction } from '~/types/matomo'

  const trpcClient = useTrpcClient()
  const route = useRoute()
  const snackbar = useSnackbar()
  const workshopId = route.params.id as string
  const matomo = useMatomo()
  const router = useRouter()
  const { mutate, error, status } =
    trpcClient.workshop.createWorkshop.useMutation()

  // Get initial workshop
  const { data: workshop, error: errorInitialWorkshop } =
    await trpcClient.workshop.getOne.useQuery({
      id: workshopId
    })

  const fetchError = computed(() => {
    if (errorInitialWorkshop.value) {
      return "L'atelier n'a pas pu être chargé."
    }
    return ''
  })
  useHead({
    title: routes.workshop.AppWorkshopDuplicate.title(workshop.value || null)
  })

  // Form
  const { handleSubmit } = useForm<CreateWorkshopInput>({
    validationSchema: toTypedSchema(createWorkshopSchema),
    initialValues: {
      name: workshop.value?.workshopName.name,
      startTime: workshop.value?.startTime,
      endTime: workshop.value?.endTime,
      location: workshop.value?.location,
      partnerOrganizationId: workshop.value?.partnerOrganizationId,
      host: workshop.value?.host,
      sessionName: workshop.value?.sessionName,
      description: workshop.value?.description,
      ageLimit: workshop.value?.ageLimit,
      ageLimitCondition: workshop.value?.ageLimitCondition,
      attendeeLimit: workshop.value?.attendeeLimit,
      chargeable: workshop.value?.chargeable
    }
  })

  const onCreateWorkshop = async (input: CreateWorkshopInput) => {
    const workshopCreated = await mutate(input)

    if (error.value || workshopCreated === null) {
      snackbar.error(
        "La création de l'atelier a échoué.",
        snackbar.focus('form', 'select')
      )
      return
    }
    matomo.trackEvent(EventCategory.Workshop, WorkshopAction.DuplicateWorkshop)
    if (input.startTime !== workshop.value?.startTime) {
      matomo.trackEvent(
        EventCategory.Workshop,
        WorkshopAction.DuplicateWorkshopAndChangeDateTime
      )
    }
    const workshopRoute = routes.workshop.AppWorkshop.path(workshopCreated.id)
    navigateTo(workshopRoute)
  }

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      onCreateWorkshop(values)
    }
  )

  const onCancel = () => {
    router.back()
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
