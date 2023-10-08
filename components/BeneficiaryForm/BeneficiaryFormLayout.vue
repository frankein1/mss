<template>
  <form
    ref="form"
    class="fr-grid-row"
    @submit="onSubmit"
  >
    <BeneficiaryFormNavigation
      class="beneficiaryformlayout__navigation fr-col-3"
      :current="current"
      :beneficiary="securityTarget"
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
      <BeneficiaryFormNavArrows
        :previous-page="previousPage"
        :next-page="nextPage"
        @save="saveTarget = $event"
      />
    </main>
    <BeneficiaryFormActions
      class="fr-col-12"
      :is-submitting="isSubmitting"
      :saved="saved"
      @save="saveTarget = undefined"
      @cancel="onCancel"
    />
  </form>
</template>

<script setup lang="ts" generic="T extends ZodSchema">
  import { ZodSchema, z } from 'zod'
  import {
    SecurityTargetWithReferents,
    SecurityTargetWithStructure
  } from '~/server/security'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import {
    Breadcrumb,
    RoutePath,
    AppBeneficiaryEditRoute,
    RouteTitle,
    AppBeneficiariesSaveRoute
  } from '~/utils/routing'

  type SubmitType = z.infer<T>

  const route = useRoute()
  const draftId = route.params.draftId as string | null

  const props = withDefaults(
    defineProps<{
      beneficiary?: SubmitType | null
      schema: T
      isSubmitting: boolean
      titleIcon?: string
      saved?: boolean
      previousPage?: { title: string; path: string }
      nextPage?: { title: string; path: string }
      current: AppBeneficiaryEditRoute | AppBeneficiariesSaveRoute
      securityTarget: SecurityTargetWithReferents & SecurityTargetWithStructure
    }>(),
    {
      beneficiary: undefined,
      titleIcon: undefined,
      saved: false,
      previousPage: undefined,
      nextPage: undefined
    }
  )

  const emit = defineEmits<{
    save: [beneficiary: SubmitType, target: string | undefined]
  }>()

  const saveTarget = ref<string | undefined>(undefined)

  const breadcrumbLinks = computed(() =>
    draftId
      ? Breadcrumb.AppBeneficiariesAdd()
      : Breadcrumb.AppBeneficiaryEdit(props.beneficiary || null)
  )

  const title = computed(() => RouteTitle[props.current]())

  useHead({ title: title.value })

  const { handleSubmit } = useForm<SubmitType>({
    validationSchema: toTypedSchema(props.schema),
    initialValues: props.beneficiary
  })

  const onSubmit = handleSubmit(values => {
    emit('save', values, saveTarget.value)
  })

  async function onCancel() {
    const originTab = route.query.originTab
      ? (route.query.originTab as BeneficiaryTab)
      : undefined

    const redirectRoute =
      !draftId && props.beneficiary
        ? RoutePath.AppBeneficiary(props.beneficiary.id, { tab: originTab })
        : RoutePath.AppBeneficiariesAdd()

    if (draftId) {
      try {
        await useTrpcClient().beneficiaryDraft.delete.mutate({ id: draftId })
      } catch {
        navigateTo(redirectRoute)
      }
    }

    navigateTo(redirectRoute)
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
