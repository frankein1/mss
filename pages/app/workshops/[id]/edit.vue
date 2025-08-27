<template>
  <div>
    <div class="fr-container">
      <WorkshopFormHeader
        v-if="workshop"
        title="Modifier un atelier"
        :breadcrumbs="breadcrumbs.workshop.AppWorkshopEdit(workshop)"
      />
    </div>
    <AtomLazyComponent
      :error="Boolean(fetchError)"
      :message="fetchError"
    >
      <WorkshopForm
        v-if="partnerOrganizations && workshop"
        :is-submitting="status === 'pending'"
        :partner-organizations="partnerOrganizations"
        :caught-errors
        update
        @submit="onSubmit"
        @cancel="onCancel"
        @delete="onDelete"
      />
    </AtomLazyComponent>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import type { UpdateWorkShopInput } from '~/server/schema'
  import { updateWorkshopSchema } from '~/server/schema'
  import WorkshopDeleteModal from '~/components/Workshop/WorkshopDeleteModal.vue'
  import { UpdateWorkshopNameMode } from '~/utils/constants/workshop'
  import { WorkshopAction, EventCategory } from '~/types/matomo'

  const trpcClient = useTrpcClient()
  const route = useRoute()
  const snackbar = useSnackbar()
  const workshopId = route.params.id as string
  const modal = useModal()
  const matomo = useMatomo()

  // Get initial workshop
  const { data: workshop, error: errorInitialWorkshop } =
    await trpcClient.workshop.getOne.useQuery({
      id: workshopId
    })

  // Get partners organisations
  const { data: partnerOrganizations, error: errorPartner } =
    await trpcClient.partner.getAll.useQuery()

  const fetchError = computed(() => {
    if (errorInitialWorkshop.value) {
      return "L'atelier n'a pas pu être chargé."
    }
    if (errorPartner.value) {
      return "La liste des partenaires n'a pas pu être chargée."
    }
    return ''
  })
  useHead({
    title: routes.workshop.AppWorkshopEdit.title(workshop.value || null)
  })

  // Form
  const { handleSubmit } = useForm<UpdateWorkShopInput>({
    validationSchema: toTypedSchema(updateWorkshopSchema),
    initialValues: {
      id: workshop.value?.id,
      name: workshop.value?.workshopName.name,
      mode: UpdateWorkshopNameMode.current,
      date: workshop.value?.date,
      startTime: workshop.value?.startTime,
      endTime: workshop.value?.endTime,
      location: workshop.value?.location,
      partnerOrganizationId: workshop.value?.partnerOrganizationId,
      host: workshop.value?.host,
      sessionName: workshop.value?.sessionName,
      description: workshop.value?.description
    }
  })

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      onUpdateWorkshop(values)
    }
  )

  const router = trpcClient.workshop
  const { mutate, error, status } = router.updateWorkshop.useMutation()
  const onUpdateWorkshop = async (input: UpdateWorkShopInput) => {
    const workshopUpdated = await mutate(input)
    if (error.value || workshopUpdated === null) {
      snackbar.error(
        "La modification de l'atelier a échoué.",
        snackbar.focus('form', 'select')
      )
      return
    }
    snackbar.success("L'atelier a été modifié avec succès.")
    if (input.name !== workshop.value?.workshopName.name) {
      matomo.trackEvent(
        EventCategory.Workshop,
        input.mode === 'all'
          ? WorkshopAction.ChangeAllNames
          : WorkshopAction.ChangeOneName
      )
    }
    const workshopRoute = routes.workshop.AppWorkshop.path(workshopUpdated.id)
    navigateTo(workshopRoute)
  }

  const onDelete = () => {
    modal.open(WorkshopDeleteModal, {
      title: `Supprimer l'atelier ${workshop.value?.workshopName.name}`,
      onDelete: async () => await deleteWorkshop()
    })
  }

  const deleteWorkshop = async () => {
    const { mutate, error } = trpcClient.workshop.delete.useMutation()
    const workshopCreated = await mutate({ id: workshopId })
    if (error.value || workshopCreated === null) {
      snackbar.error("La suppression de l'atelier a échoué.")
      return
    }
    modal.close()
    matomo.trackEvent(EventCategory.Workshop, WorkshopAction.DeleteWorkshop)
    snackbar.success("L'atelier a été supprimé avec succès.")
    navigateTo(routes.workshop.AppWorkshops.path())
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
