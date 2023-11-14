<template>
  <BeneficiaryFormLeave />
  <form
    ref="form"
    novalidate
    class="fr-grid-row"
    @submit.prevent="onSubmit"
  >
    <BeneficiariesSaveFormNavigation
      class="beneficiaryformlayout__navigation fr-col-3"
      :current-route="currentRoute"
      :draft-id="draftId"
      :permissions="permissions"
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
  import { beneficiaryFieldLabels, relativeFieldLabels } from '~/client/labels'
  import { BeneficiaryPermissions } from '~/server/security'
  import type { FieldLabels } from '~/types/fieldLabels'

  type SubmitType = z.infer<T>

  const props = defineProps<{
    beneficiary?: SubmitType | null
    permissions?: BeneficiaryPermissions
    schema: T
    isSubmitting: boolean
    titleIcon?: string
    currentRoute: AppBeneficiariesSaveRoute
    draftId: string
  }>()

  const emit = defineEmits<{
    save: [beneficiary: SubmitType, target: string | undefined]
  }>()

  const saveTarget = ref<string | undefined>(undefined)
  const beneficiaryFormLayoutMainContainer = ref<HTMLElement | null>(null)
  const form = ref<HTMLFormElement | null>(null)
  const isNavigatingWithFormActions = ref(false)

  const breadcrumbLinks = computed(() => Breadcrumb.AppBeneficiariesAdd())

  const title = computed(() => RouteTitle[props.currentRoute]())

  useHead({ title: title.value })

  const { handleSubmit } = useForm<SubmitType>({
    validationSchema: toTypedSchema(props.schema),
    initialValues: props.beneficiary as SubmitType
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

  useLeaveBeneficiaryFormConfirmation(isNavigatingWithFormActions, {
    onLeave: () =>
      useTrpcMutation({
        mutation: () =>
          useTrpcClient().beneficiaryDraft.delete.mutate({
            id: props.draftId
          })
      })
  })

  function onCancel() {
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
