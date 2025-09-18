<template>
  <OpenModalHack />
  <form
    v-if="beneficiaryIdentification"
    ref="form"
    novalidate
    class="fr-grid-row form-wrapper"
    @submit.prevent="onSubmit"
  >
    <BeneficiaryEditFormNavigation
      class="form-navigation content beneficiaryformlayout__navigation fr-col-12 fr-col-md-3"
      :permissions="permissions"
      :current-route="currentRoute"
      :beneficiary-id="beneficiaryIdentification.id"
      :origin-tab="originTab"
      :beneficiary-form-layout-main-container="
        beneficiaryFormLayoutMainContainer
      "
      @save="saveTarget = $event"
    />
    <div
      ref="beneficiaryFormLayoutMainContainer"
      class="beneficiary-form-content content fr-col-12 fr-col-md-9 fr-container"
    >
      <AtomBreadcrumb
        :links="
          breadcrumbs.file.AppFileBeneficiaryEdit(
            familyFileId,
            familyIdentification,
            beneficiaryIdentification
          )
        "
      />
      <PageTitle
        :class="smallTitle ? 'beneficiary-form-title-small' : ''"
        :title="title"
        :icon="titleIcon"
      >
        <RequiredFields v-if="hasRequiredFields" />
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
    </div>
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
  import type { ZodSchema, z } from 'zod'
  import type { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { beneficiaryFieldLabels, relativeFieldLabels } from '~/client/labels'
  import type { FamilyFilePermissions } from '~/server/security'
  import type { FieldLabels } from '~/types/fieldLabels'
  import type {
    BeneficiaryIdentification,
    BeneficiaryFileIdentification
  } from '~/types/beneficiary'
  import type { AppBeneficiaryEditRoute } from '~/utils/routes'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  type SubmitType = z.infer<T>

  const router = useRouter()
  const route = useRoute()
  const originTab = route.query.originTab
    ? (route.query.originTab as BeneficiaryTab)
    : undefined
  const saved = route.query.saved !== undefined

  const props = withDefaults(
    defineProps<{
      familyFileId: string
      familyIdentification: BeneficiaryFileIdentification[]
      beneficiaryIdentification: BeneficiaryIdentification | null
      bindedValues: z.infer<T> | null
      permissions: FamilyFilePermissions | undefined
      schema: T
      isSubmitting: boolean
      titleIcon?: string
      smallTitle?: boolean
      currentRoute: AppBeneficiaryEditRoute
      hasRequiredFields?: boolean
    }>(),
    {
      titleIcon: undefined,
      hasRequiredFields: true,
      smallTitle: false
    }
  )

  const emit = defineEmits<{
    save: [beneficiary: SubmitType, target: string | undefined]
  }>()

  const saveTarget = ref<string | undefined>(undefined)
  const beneficiaryFormLayoutMainContainer = ref<HTMLElement | null>(null)
  const form = ref<HTMLFormElement | null>(null)

  const title = computed(() => {
    let title = 'Informations'
    if (props.beneficiaryIdentification?.firstName) {
      title = title + ' ' + props.beneficiaryIdentification.firstName
    }
    if (props.beneficiaryIdentification?.usualName) {
      title = title + ' ' + props.beneficiaryIdentification.usualName
    }
    return title
  })

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
  }

  const isFormDirty = computed(() => meta.value.dirty)

  const { isNavigatingWithFormActions } = useLeaveFormConfirmation({
    isFormDirty
  })

  /** The initial values and current values of the form are compared
   * in order to only send a API call if the data has to be updated
   */
  function formContentHasChanged(v: SubmitType) {
    return JSON.stringify(meta.value.initialValues) !== JSON.stringify(v)
  }

  const { onSubmit, caughtErrors } = useCatchFormErrors(
    handleSubmit,
    values => {
      const fileRoute = routes.file.AppFile.path(props.familyFileId || '', {
        beneficiaryId: props.beneficiaryIdentification?.id || ''
      })
      const postSubmitUrl = saveTarget.value || fileRoute

      isNavigatingWithFormActions.value = true

      if (formContentHasChanged(values)) {
        emit('save', values, postSubmitUrl)
      } else {
        navigateTo(postSubmitUrl)
      }
    }
  )

  const { errors } = useDisplayFormErrors(form, caughtErrors, {
    ...beneficiaryFieldLabels,
    ...relativeFieldLabels
  } as FieldLabels<Partial<T>>)

  function onCancel() {
    if (props.beneficiaryIdentification) {
      navigateTo(
        routes.file.AppFile.path(props.familyFileId, {
          beneficiaryId: props.beneficiaryIdentification.id,
          tab: originTab
        })
      )
    }
  }
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .form-wrapper {
    display: flex;
    flex-direction: column;

    @include dsfr-media-query.respond-from('md') {
      flex-direction: row;
    }
  }

  main form .beneficiary-form-content {
    @include dsfr-media-query.respond-from('md') {
      height: calc(100vh - #{$actions-bar-height} - #{$top-bar-height});
    }
  }

  .form-navigation {
    border: none;

    @include dsfr-media-query.respond-from('md') {
      border-right: 1px solid var(--border-default-grey);
      height: calc(100vh - #{$actions-bar-height} - #{$top-bar-height});
    }
  }
</style>
<style lang="scss">
  .beneficiary-form-title-small {
    .pagetitle__title {
      font-size: 1.5rem;
      line-height: 1.75rem;
    }

    .pagetitle__slot {
      margin-top: 0 !important;
    }

    .pagetitle__icon {
      padding: 0.75rem;
      margin-right: 1rem !important;

      span {
        transform: scale(0.75);
      }
    }
  }
</style>
