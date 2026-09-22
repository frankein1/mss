<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <PageContainer>
      <AtomBreadcrumb :links="breadcrumbs.structure.AppStructureUserAdd()" />
      <NuxtLink
        class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-arrow-left-line fr-mb-4v"
        :to="routes.structure.AppStructureUsers.path()"
      >
        Retour
      </NuxtLink>
      <PageTitle :title="title">
        <RequiredFields />
      </PageTitle>

      <FormErrors
        v-if="errors.length > 1"
        :errors="errors"
      />
      <UserFormProfil />
      <UserFormAccessAndRole class="fr-mt-8v" />
    </PageContainer>
    <UserFormActions
      :is-submitting="status === 'pending'"
      @cancel="onCancel"
    />
  </form>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { createUserSchema, type CreateUserInput } from '~~/server/schema'
  import { userFieldLabels } from '~~/client/labels'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()
  const title = routes.structure.AppStructureUserAdd.title
  const form = useTemplateRef('form')

  useHead({ title })

  // Form
  const { handleSubmit } = useForm<CreateUserInput>({
    validationSchema: toTypedSchema(createUserSchema)
  })

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      onUpdateUser(values)
    }
  )
  const { errors } = useDisplayFormErrors(form, caughtErrors, userFieldLabels)

  const { mutate, error, status } = trpcClient.user.add.useMutation()
  const onUpdateUser = async (input: CreateUserInput) => {
    const user = await mutate(input)
    if (error.value || !user) {
      snackbar.error("La création de l'utilisateur a échoué.")
      return
    }
    snackbar.success("L'utilisateur a été créé avec succès.")
    navigateTo(routes.structure.AppStructureUsers.path())
  }

  const onCancel = () => {
    useRouter().back()
  }
</script>

<style scoped>
  .feature-section {
    padding: 2rem;
  }

  .structure-info {
    padding: 2rem;
  }

  .structure-info__title {
    margin-bottom: 1rem;
  }
</style>
