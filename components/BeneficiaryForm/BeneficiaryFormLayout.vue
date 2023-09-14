<template>
  <form
    ref="form"
    class="fr-grid-row"
    @submit="onSubmit"
  >
    <BeneficiaryFormNavigation
      class="beneficiaryformlayout__navigation fr-col-3"
    />
    <main class="beneficiaryformlayout__main fr-col-9 fr-container">
      <DsfrBreadcrumb :links="breadcrumbLinks" />
      <PageTitle
        :title="title"
        :icon="titleIcon"
      >
        <RequiredFields />
      </PageTitle>

      <slot></slot>
    </main>
    <BeneficiaryFormActions
      class="fr-col-12"
      :is-submitting="isSubmitting"
      @save="saveAndLeave = true"
      @cancel="onCancel"
    />
  </form>
</template>

<script setup lang="ts" generic="T extends ZodSchema">
  import { ZodSchema, z } from 'zod'
  import { Breadcrumb, RoutePath } from '~/utils/routing'

  type SubmitType = z.infer<T>

  const route = useRoute()

  const props = withDefaults(
    defineProps<{
      beneficiary?: SubmitType | null
      schema: T
      isSubmitting: boolean
      isEditting?: boolean
      title: string
      titleIcon?: string
    }>(),
    { beneficiary: undefined, isEditing: false, titleIcon: undefined }
  )

  const emit = defineEmits<{
    save: [beneficiary: SubmitType, saveAndLeave: boolean]
  }>()

  const saveAndLeave = ref(false)

  const breadcrumbLinks = computed(() =>
    props.isEditting
      ? Breadcrumb.AppBeneficiaryEdit(props.beneficiary || null)
      : Breadcrumb.AppBeneficiariesAdd()
  )

  useHead({ title: props.title })

  const { handleSubmit } = useForm<SubmitType>({
    validationSchema: toTypedSchema(props.schema),
    initialValues: props.beneficiary
  })

  const onSubmit = handleSubmit(values => {
    emit('save', values, saveAndLeave.value)
  })

  async function onCancel() {
    const draftId = route.query.draftId as string | null

    if (draftId) {
      try {
        await useTrpcClient().beneficiaryDraft.delete.mutate({ id: draftId })
      } catch {
        navigateTo(RoutePath.AppBeneficiariesAdd())
      }
    }

    navigateTo(RoutePath.AppBeneficiariesAdd())
  }
</script>

<style lang="scss" scoped>
  $navbar-height: 3.5rem;
  $actions-bar-height: 5.5625rem;

  .beneficiaryformlayout__navigation,
  .beneficiaryformlayout__main {
    height: calc(100vh - #{$navbar-height} - #{$actions-bar-height});
    overflow: scroll;
  }

  .beneficiaryformlayout__navigation {
    border-right: 1px solid var(--border-default-grey);
  }
</style>
