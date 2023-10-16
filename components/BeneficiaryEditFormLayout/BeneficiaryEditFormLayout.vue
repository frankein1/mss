<template>
  <form
    v-if="beneficiary"
    ref="form"
    novalidate
    class="fr-grid-row"
    @submit.prevent="onSubmit"
  >
    <BeneficiaryEditFormNavigation
      class="beneficiaryformlayout__navigation fr-col-3"
      :current-route="currentRoute"
      :security-target="beneficiary"
      :beneficiary-id="beneficiary.id"
      :origin-tab="originTab"
      :beneficiary-form-layout-main-container="
        beneficiaryFormLayoutMainContainer
      "
      @save="saveTarget = $event"
    />
    <main
      ref="beneficiaryFormLayoutMainContainer"
      class="beneficiaryformlayout__main fr-col-9 fr-container"
    >
      <DsfrBreadcrumb :links="breadcrumbLinks" />
      <PageTitle
        :title="title"
        :icon="titleIcon"
      >
        <RequiredFields />
      </PageTitle>

      <slot></slot>
      <BeneficiaryEditFormNavArrows
        :security-target="beneficiary"
        :current-route="currentRoute"
        :beneficiary-id="beneficiary.id"
        :origin-tab="originTab"
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
  import { MinimalBeneficiaryForFormLayout } from '~/types/beneficiary'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import {
    Breadcrumb,
    RoutePath,
    AppBeneficiaryEditRoute,
    RouteTitle
  } from '~/utils/routing'

  type SubmitType = z.infer<T>

  const router = useRouter()
  const route = useRoute()
  const originTab = route.query.originTab
    ? (route.query.originTab as BeneficiaryTab)
    : undefined
  const saved = route.query.saved !== undefined

  const props = withDefaults(
    defineProps<{
      beneficiary: MinimalBeneficiaryForFormLayout | null
      schema: T
      isSubmitting: boolean
      titleIcon?: string
      currentRoute: AppBeneficiaryEditRoute
    }>(),
    {
      titleIcon: undefined
    }
  )

  const emit = defineEmits<{
    save: [beneficiary: SubmitType, target: string | undefined]
  }>()

  const saveTarget = ref<string | undefined>(undefined)
  const beneficiaryFormLayoutMainContainer = ref<HTMLElement | null>(null)

  const breadcrumbLinks = computed(() =>
    Breadcrumb.AppBeneficiaryEdit(props.beneficiary)
  )

  const title = computed(() => RouteTitle[props.currentRoute]())

  useHead({ title: title.value })

  onMounted(() => {
    /**
     * Removes the saved query param to prevent reloading the page when
     * changing sub section from side navigation (as saved query parem would be
     * missing from the targetted path). It also allows to prevent showing the
     * page as saved again when reloading it.
     */
    router.replace({ path: route.path, hash: route.hash })
  })

  const { handleSubmit } = useForm<SubmitType>({
    validationSchema: toTypedSchema(props.schema),
    initialValues: props.beneficiary as SubmitType
  })

  const onSubmit = handleSubmit(values => {
    emit('save', values, saveTarget.value)
  })

  function onCancel() {
    if (!props.beneficiary) {
      navigateTo(RoutePath.AppBeneficiaries())
    } else {
      navigateTo(
        RoutePath.AppBeneficiary(props.beneficiary.id, { tab: originTab })
      )
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
