<template>
  <AtomLazyComponent
    :error="Boolean(initialUserError)"
    :pending="initialUserStatus === 'idle' || initialUserStatus === 'pending'"
    message="Les informations de l'utilisateur n'ont pas pu être chargées."
  >
    <form
      v-if="user"
      ref="form"
      novalidate
      @submit.prevent="onSubmit"
    >
      <PageContainer class="container">
        <AtomBreadcrumb :links="breadcrumbLinks" />
        <NuxtLink
          class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-arrow-left-line fr-mb-4v"
          :to="routes.structure.AppStructure.path()"
        >
          Retour
        </NuxtLink>
        <PageTitle :title="title" />
        <UserFormProfil update />
        <UserFormAccessAndRole
          update
          class="fr-mt-8v"
          :user="user"
        />
      </PageContainer>
      <UserFormActions
        :is-submitting="status === 'pending'"
        :user-id="userId"
        @cancel="onCancel"
      />
    </form>
  </AtomLazyComponent>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { editUserSchema, type UpdateUserInput } from '~/server/schema'

  const route = useRoute()
  const userId = route.params.id as string
  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()
  const {
    data: user,
    status: initialUserStatus,
    error: initialUserError
  } = await trpcClient.user.get.useQuery({
    id: userId
  })

  const title = routes.structure.AppStructureUserEdit.title(
    `${user?.value?.firstName} ${user?.value?.lastName}`
  )
  useHead({ title })

  const breadcrumbLinks = computed(() =>
    breadcrumbs.structure.AppStructureUserEdit(
      `${user?.value?.firstName} ${user?.value?.lastName}`
    )
  )

  // Form
  const { handleSubmit } = useForm<UpdateUserInput>({
    validationSchema: toTypedSchema(editUserSchema),
    initialValues: {
      ...user.value,
      status: user.value?.status === 'Active'
    }
  })

  const { onSubmit } = useCatchFormErrors(handleSubmit, values => {
    onUpdateUser(values)
  })

  const { mutate, error, status } = trpcClient.user.update.useMutation()
  const onUpdateUser = async (input: UpdateUserInput) => {
    const userUpdated = await mutate(input)
    if (error.value || userUpdated === null) {
      snackbar.error("La modification de l'utilisateur a échoué.", () =>
        snackbar.focus('form', 'select')
      )
      return
    }
    snackbar.success("L'utilisateur a été modifié avec succès.")
    // TODO add matomo ??
    await navigateTo(routes.structure.AppStructure.path())
  }

  const onCancel = () => {
    useRouter().back()
  }
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .container {
    @include dsfr-media-query.respond-from('sm') {
      min-height: calc(100vh - 6.0625rem - 3.5rem);
    }
  }
</style>
