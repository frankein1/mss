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
        :update="true"
        :workshop-name="workshop.workshopName.name"
        @submit="onSubmit"
        @cancel="onCancel"
        @delete="onDelete"
        @open-modal-name="onNameUpdate"
      />
    </AtomLazyComponent>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { UpdateWorkShopInput, updateWorkshopSchema } from '~/server/schema'
  import WorkshopDeleteModal from '~/components/Workshop/WorkshopDeleteModal.vue'
  import WorkshopNameUpdateModal from '~/components/Workshop/WorkshopNameUpdateModal.vue'
  import { UpdateWorkshopNameInput } from '~/server/schema/workshop/updateWorkshopName.schema'

  const trpcClient = useTrpcClient()
  const route = useRoute()
  const snackbar = useSnackbar()
  const workshopId = route.params.id as string
  const modal = useModal()

  // Get initial workshop
  const {
    data: workshop,
    error: errorInitialWorkshop,
    refresh
  } = await trpcClient.workshop.getOne.useQuery({
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
    snackbar.success("L'atelier a été supprimé avec succès.")
    navigateTo(routes.workshop.AppWorkshops.path())
  }

  const onCancel = () => {
    useRouter().back()
  }

  async function onNameUpdate() {
    if (!workshop.value) {
      throw createError('missing workshop entity')
    }
    modal.open(WorkshopNameUpdateModal, {
      title: `Modifier le nom de l'atelier`,
      initialValues: { name: workshop.value.workshopName.name },
      isSubmitting: statusName.value === 'pending',
      onUpdate: async (values: { name: string }) => {
        if (!workshop.value) {
          throw createError('missing workshop entity')
        }
        await updateWorkshopName({
          id: workshop.value.workshopNameId,
          ...values
        })
      }
    })
  }

  const {
    mutate: mutateName,
    error: errorName,
    status: statusName
  } = trpcClient.workshop.updateWorkshopName.useMutation()

  async function updateWorkshopName(values: UpdateWorkshopNameInput) {
    const updated = await mutateName(values)

    if (errorName.value || !updated) {
      snackbar.error(
        "La modification du nom de l'atelier à échoué",
        snackbar.focus()
      )
      return
    }
    modal.close()
    await refresh()
    snackbar.success("Le nom de l'atelier a été modifié avec succès.")
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
