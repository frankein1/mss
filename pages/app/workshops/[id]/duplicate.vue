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
        @submit="askForParticipants"
        @cancel="onCancel"
      />
      <OpenModalHack />
    </AtomLazyComponent>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import type { DuplicateWorkshopInput } from '~/server/schema'
  import { duplicateWorkshopSchema } from '~/server/schema'
  import { EventCategory, WorkshopAction } from '~/types/matomo'
  import WorkshopDuplicateModal from '~/components/WorkshopForm/WorkshopDuplicateModal.vue'

  const trpcClient = useTrpcClient()
  const route = useRoute()
  const snackbar = useSnackbar()
  const workshopId = route.params.id as string
  const matomo = useMatomo()
  const router = useRouter()
  const { mutate, error, status } =
    trpcClient.workshop.duplicateWorkshop.useMutation()

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
  const { handleSubmit } = useForm<DuplicateWorkshopInput>({
    validationSchema: toTypedSchema(duplicateWorkshopSchema),
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

  const pendingFormValues = ref<DuplicateWorkshopInput | null>(null)

  const onDuplicateWorkshop = async (duplicateParticipants: boolean) => {
    if (!pendingFormValues.value) {
      return
    }
    modal.close()

    const workshopCreated = await mutate({
      ...pendingFormValues.value,
      sourceWorkshopId: workshopId,
      duplicateParticipants
    })

    if (error.value || !workshopCreated) {
      snackbar.error(
        "La duplication de l'atelier a échoué.",
        snackbar.focus('form', 'select')
      )
      return
    }
    matomo.trackEvent(EventCategory.Workshop, WorkshopAction.DuplicateWorkshop)
    if (pendingFormValues.value.startTime !== workshop.value?.startTime) {
      matomo.trackEvent(
        EventCategory.Workshop,
        WorkshopAction.DuplicateWorkshopAndChangeDateTime
      )
    }
    navigateTo(routes.workshop.AppWorkshop.path(workshopCreated.id))
  }

  // open Modal after form validation
  const modal = useModal()
  const { onSubmit: askForParticipants, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      pendingFormValues.value = values
      modal.open(WorkshopDuplicateModal, {
        triggerOpen: true,
        title: 'Dupliquer les personnes participantes',
        cancel: () => modal.close(),
        submit: onDuplicateWorkshop
      })
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
