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
      <PageTitle :title="title">
        <RequiredFields />
      </PageTitle>

      <slot></slot>
    </main>
    <BeneficiaryFormActions
      class="fr-col-12"
      :is-submitting="isSubmitting"
    />
  </form>
</template>

<script setup lang="ts" generic="T extends ZodSchema">
  import { ZodSchema, z } from 'zod'
  import { Breadcrumb, RouteTitle } from '~/utils/routing'

  type SubmitType = z.infer<T>

  const props = withDefaults(
    defineProps<{
      beneficiary?: SubmitType
      schema: T
      isSubmitting: boolean
    }>(),
    { beneficiary: undefined }
  )

  const emit = defineEmits<{
    save: SubmitType
  }>()

  const breadcrumbLinks = computed(() =>
    props.beneficiary
      ? Breadcrumb.AppBeneficiaryEdit(props.beneficiary)
      : Breadcrumb.AppBeneficiariesAdd()
  )

  const title = computed(() =>
    props.beneficiary
      ? RouteTitle.AppBeneficiaryEdit(props.beneficiary)
      : RouteTitle.AppBeneficiariesAdd()
  )

  useHead({ title })

  const { handleSubmit } = useForm<SubmitType>({
    validationSchema: toTypedSchema(props.schema)
    // TODO:
    // initialValues: {
    // }
  })

  const onSubmit = handleSubmit(values => {
    emit('save', values)
  })
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
