<template>
  <form
    ref="form"
    class="fr-grid-row"
    @submit="onSubmit"
  >
    <BeneficiariesSaveFormNavigation
      class="beneficiaryformlayout__navigation fr-col-3"
      :current-route="currentRoute"
      :draft-id="draftId"
      @save="saveTarget = $event"
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
      <BeneficiariesSaveFormNavArrows
        :current-route="currentRoute"
        :draft-id="draftId"
        @save="saveTarget = $event"
      />
    </main>
    <BeneficiaryFormActions
      class="fr-col-12"
      :is-submitting="isSubmitting"
      @save="saveTarget = undefined"
      @cancel="onCancel"
    />
  </form>
</template>

<script setup lang="ts" generic="T extends ZodSchema">
  import { ZodSchema, z } from 'zod'
  import {
    Breadcrumb,
    RoutePath,
    RouteTitle,
    AppBeneficiariesSaveRoute
  } from '~/utils/routing'

  type SubmitType = z.infer<T>

  const props = withDefaults(
    defineProps<{
      beneficiary?: SubmitType | null
      schema: T
      isSubmitting: boolean
      titleIcon?: string
      currentRoute: AppBeneficiariesSaveRoute
      draftId: string
    }>(),
    {
      beneficiary: undefined,
      titleIcon: undefined
    }
  )

  const emit = defineEmits<{
    save: [beneficiary: SubmitType, target: string | undefined]
  }>()

  const saveTarget = ref<string | undefined>(undefined)

  const breadcrumbLinks = computed(() => Breadcrumb.AppBeneficiariesAdd())

  const title = computed(() => RouteTitle[props.currentRoute]())

  useHead({ title: title.value })

  const { handleSubmit } = useForm<SubmitType>({
    validationSchema: toTypedSchema(props.schema),
    initialValues: props.beneficiary as SubmitType
  })

  const onSubmit = handleSubmit(values => {
    emit('save', values, saveTarget.value)
  })

  async function onCancel() {
    try {
      await useTrpcClient().beneficiaryDraft.delete.mutate({
        id: props.draftId
      })
      navigateTo(RoutePath.AppBeneficiariesAdd())
    } catch {
      navigateTo(RoutePath.AppBeneficiariesAdd())
    }
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
