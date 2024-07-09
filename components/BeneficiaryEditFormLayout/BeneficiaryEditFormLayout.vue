<template>
  <OpenModalHack />
  <form
    v-if="beneficiaryIdentification"
    ref="form"
    novalidate
    class="fr-grid-row"
    @submit.prevent="onSubmit"
  >
    <BeneficiaryEditFormNavigation
      class="content beneficiaryformlayout__navigation fr-col-3"
      :permissions="permissions"
      :current-route="currentRoute"
      :beneficiary-id="beneficiaryIdentification.id"
      :origin-tab="originTab"
      :beneficiary-form-layout-main-container="
        beneficiaryFormLayoutMainContainer
      "
      @save="saveTarget = $event"
    />
    <main
      ref="beneficiaryFormLayoutMainContainer"
      class="content fr-col-9 fr-container"
    >
      <!-- <DsfrBreadcrumb :links="breadcrumbLinks" /> -->
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
        :beneficiary-id="beneficiaryIdentification.id"
        :origin-tab="originTab"
        :permissions="permissions"
        @save="saveTarget = $event"
      />
    </main>
    <BeneficiaryFormActions
      class="fr-col-12"
      :is-submitting="isSubmitting"
      :saved="saved"
      @save="onSave"
      @cancel="onCancel"
    />
  </form>
</template>

<script setup lang="ts" generic="T extends ZodSchema">
  import { ZodSchema, z } from 'zod'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import {
    Breadcrumb,
    RoutePath,
    AppBeneficiaryEditRoute,
    RouteTitle
  } from '~/utils/routing'
  import { beneficiaryFieldLabels, relativeFieldLabels } from '~/client/labels'
  import { FamilyFilePermissions } from '~/server/security'
  import type { FieldLabels } from '~/types/fieldLabels'
  import { BeneficiaryIdentification } from '~/types/beneficiary'

  type SubmitType = z.infer<T>

  const router = useRouter()
  const route = useRoute()
  const originTab = route.query.originTab
    ? (route.query.originTab as BeneficiaryTab)
    : undefined
  const saved = route.query.saved !== undefined

  const props = withDefaults(
    defineProps<{
      draft: boolean
      beneficiaryIdentification: BeneficiaryIdentification | null
      bindedValues: z.infer<T> | null
      permissions: FamilyFilePermissions | undefined
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
    save: [
      beneficiary: SubmitType,
      target: string | undefined,
      validate: boolean
    ]
  }>()

  const trpcClient = useTrpcClient()

  const saveTarget = ref<string | undefined>(undefined)
  const validate = ref<boolean>(false)
  const beneficiaryFormLayoutMainContainer = ref<HTMLElement | null>(null)
  const form = ref<HTMLFormElement | null>(null)

  const breadcrumbLinks = computed(() => {
    if (props.draft) {
      return Breadcrumb.AppBeneficiariesAdd()
    }
    return Breadcrumb.AppBeneficiaryEdit(props.beneficiaryIdentification)
  })

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
    initialValues: props.bindedValues as SubmitType
  })

  function onSave() {
    saveTarget.value = undefined
    validate.value = true
  }

  const isFormDirty = computed(() => meta.value.dirty)

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty: props.draft ? ref(true) : isFormDirty,
    onLeave: async () => {
      if (props.beneficiaryIdentification && props.draft) {
        const id = props.beneficiaryIdentification.id
        await trpcClient.beneficiary.deleteDraft.mutate({ id })
      }
    }
  })

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      emit('save', values, saveTarget.value, validate.value)
      isNavigatingWithFormActions.value = true
    }
  )

  const { errors } = useDisplayFormErrors(form, caughtErrors, {
    ...beneficiaryFieldLabels,
    ...relativeFieldLabels
  } as FieldLabels<Partial<T>>)

  function onCancel() {
    if (props.beneficiaryIdentification) {
      const id = props.beneficiaryIdentification.id
      if (props.draft) {
        navigateTo(RoutePath.AppBeneficiaries())
      } else if (props.beneficiaryIdentification) {
        navigateTo(
          RoutePath.AppBeneficiary(id, {
            tab: originTab
          })
        )
      }
    }
  }
</script>

<style lang="scss" scoped>
  .beneficiaryformlayout__navigation {
    border-right: 1px solid var(--border-default-grey);
  }
</style>
