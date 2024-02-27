<template>
  <OpenModalHack />
  <form
    v-if="beneficiary"
    ref="form"
    novalidate
    class="fr-grid-row"
    @submit.prevent="onSubmit"
  >
    <BeneficiaryEditFormNavigation
      class="beneficiaryformlayout__navigation fr-col-3"
      :permissions="permissions"
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

      <FormErrors
        v-if="errors.length > 1"
        :errors="errors"
      />

      <slot></slot>
      <BeneficiaryEditFormNavArrows
        :current-route="currentRoute"
        :beneficiary-id="beneficiary.id"
        :origin-tab="originTab"
        :permissions="permissions"
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
  import { beneficiaryFieldLabels, relativeFieldLabels } from '~/client/labels'
  import { BeneficiaryPermissions } from '~/server/security'
  import type { FieldLabels } from '~/types/fieldLabels'

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
      permissions: BeneficiaryPermissions | undefined
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
  const form = ref<HTMLFormElement | null>(null)
  const isNavigatingWithFormActions = ref(false)

  const breadcrumbLinks = computed(() =>
    Breadcrumb.AppBeneficiaryEdit(props.beneficiary)
  )

  const title = computed(() => RouteTitle[props.currentRoute]())

  useHead({ title: title.value })

  onMounted(() => {
    const { saved: _, ...query } = route.query

    /**
     * Removes the saved query param to prevent reloading the page when
     * changing sub section from side navigation (as saved query param would be
     * missing from the targetted path). It also allows to prevent showing the
     * page as saved again when reloading it.
     */
    router.replace({ path: route.path, query, hash: route.hash })
  })

  const { handleSubmit, meta } = useForm<SubmitType>({
    validationSchema: toTypedSchema(props.schema),
    initialValues: props.beneficiary as SubmitType
  })

  const isFormDirty = computed(() => meta.value.dirty)

  useLeaveBeneficiaryFormConfirmation(isNavigatingWithFormActions, {
    isFormDirty
  })

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      emit('save', values, saveTarget.value)
      isNavigatingWithFormActions.value = true
    }
  )

  const { errors } = useDisplayFormErrors(form, caughtErrors, {
    ...beneficiaryFieldLabels,
    ...relativeFieldLabels
  } as FieldLabels<Partial<T>>)

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
