<template>
  <FormErrors
    v-if="errors.length > 1"
    :errors="errors"
  />
  <form
    ref="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="fr-container">
      <WorkshopCreationFormName
        :is-submitting="isSubmitting"
        :name-options="nameOptions"
      />
      <WorkshopCreationFormInformation
        :is-submitting="isSubmitting"
        :partner-organizations="partnerOrganizations"
      />
      <WorkshopCreationFormDescription :is-submitting="isSubmitting" />
      <WorkshopCreationFormConditions
        :is-submitting="isSubmitting"
        :age-condition-options="ageConditionKeys.options"
      />

      <AtomCallout>
        <p>
          Vous pourrez inscrire des participants et participantes sur la page
          suivante.
        </p>
      </AtomCallout>
    </div>

    <AtomActionsBar class="sticky">
      <WorkshopCreationFormActions
        :is-submitting="isSubmitting"
        @cancel="emit('cancel')"
      />
    </AtomActionsBar>
  </form>
</template>

<script setup lang="ts">
  import { CreateWorkshopInput, createWorkshopSchema } from '~/server/schema'
  import { PartnerOrganizationIdName } from '~/types/partner'
  import { ageConditionKeys } from '~/client/options'
  import { workshops } from '~/prisma/workshop_seed'

  defineProps<{
    isSubmitting: boolean
    partnerOrganizations: Array<PartnerOrganizationIdName>
  }>()

  const emit = defineEmits<{
    saveWorkshop: [workshop: CreateWorkshopInput]
    cancel: []
  }>()

  const nameOptions: Options = workshops.map(w => ({
    label: w.name,
    value: w.name
  }))

  const errors = ref<
    {
      name: string
      message: string
    }[]
  >([])
  const form = ref<HTMLFormElement | null>(null)

  const { handleSubmit, values } = useForm<CreateWorkshopInput>({
    validationSchema: toTypedSchema(createWorkshopSchema)
  })
  watch(values, () => {
    console.log(values)
  })
  const onSubmit = handleSubmit(values => {
    emit('saveWorkshop', values)
  })
</script>

<style scoped>
  .fr-container {
    max-width: 58rem;
  }

  .fr-grid-row {
    align-items: baseline;
  }

  .leaf-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M9.97308 18H11V13H13V18H14.0269C14.1589 16.7984 14.7721 15.8065 15.7676 14.7226C15.8797 14.6006 16.5988 13.8564 16.6841 13.7501C17.5318 12.6931 18 11.385 18 10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10C6 11.3843 6.46774 12.6917 7.31462 13.7484C7.40004 13.855 8.12081 14.6012 8.23154 14.7218C9.22766 15.8064 9.84103 16.7984 9.97308 18ZM10 20V21H14V20H10ZM5.75395 14.9992C4.65645 13.6297 4 11.8915 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10C20 11.8925 19.3428 13.6315 18.2443 15.0014C17.624 15.7748 16 17 16 18.5V21C16 22.1046 15.1046 23 14 23H10C8.89543 23 8 22.1046 8 21V18.5C8 17 6.37458 15.7736 5.75395 14.9992Z'%3E%3C/path%3E%3C/svg%3E");
  }

  .uppercase {
    text-transform: uppercase;
  }

  .date-grid {
    width: 100%;
  }

  .fr-fieldset {
    justify-content: center;
  }

  .workshop-form-toggle {
    margin-top: -1rem;

    :deep(label) {
      width: 100%;
    }

    :deep(label::before) {
      margin-right: 1rem;
    }
  }

  /* FOOTER */
  .sticky {
    position: sticky;
    bottom: 0;

    /* overide fr-btn-group rules on button with icon */
    .fr-btn--icon-left {
      max-width: 100% !important;
      padding: 0.5rem 1rem !important;

      &::before {
        --icon-size: 1.5rem !important;

        margin-left: 0.5rem !important;
        margin-right: 0.5rem !important;
      }
    }
  }
</style>
