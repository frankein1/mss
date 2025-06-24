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
        :pending="pending"
      />
      <WorkshopCreationFormInformation
        :is-submitting="isSubmitting"
        :pending="pending"
        :partner-options="partnerOptions"
        :hour-options="hourOptions"
      />
      <WorkshopCreationFormDescription
        :is-submitting="isSubmitting"
        :pending="pending"
      />
      <WorkshopCreationFormConditions
        :is-submitting="isSubmitting"
        :pending="pending"
        :age-condition-options="ageConditionOptions"
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
        :pending="pending"
        @cancel="emit('cancel')"
      />
    </AtomActionsBar>
  </form>
</template>

<script setup lang="ts">
  defineProps<{
    isSubmitting: boolean
  }>()

  const emit = defineEmits<{
    saveWorkshop: [workshop: any]
    cancel: []
  }>()

  const pending = ref<boolean>(false)
  const errors = ref<
    {
      name: string
      message: string
    }[]
  >([])
  const form = ref<HTMLFormElement | null>(null)

  const { values: formValues } = useForm({
    initialValues: {
      ageCondition: undefined,
      rateLimit: false
    }
  })
  const onSubmit = () => {
    console.log(formValues)
    emit('saveWorkshop', {})
  }

  // Tableau des heures (24 heures)
  const hourOptions = [
    { label: '00:00', value: '00:00' },
    { label: '00:15', value: '00:15' },
    { label: '00:30', value: '00:30' },
    { label: '00:45', value: '00:45' },
    { label: '01:00', value: '01:00' },
    { label: '01:15', value: '01:15' },
    { label: '01:30', value: '01:30' },
    { label: '01:45', value: '01:45' },
    { label: '02:00', value: '02:00' },
    { label: '02:15', value: '02:15' },
    { label: '02:30', value: '02:30' },
    { label: '02:45', value: '02:45' },
    { label: '03:00', value: '03:00' },
    { label: '03:15', value: '03:15' },
    { label: '03:30', value: '03:30' },
    { label: '03:45', value: '03:45' },
    { label: '04:00', value: '04:00' },
    { label: '04:15', value: '04:15' },
    { label: '04:30', value: '04:30' },
    { label: '04:45', value: '04:45' },
    { label: '05:00', value: '05:00' },
    { label: '05:15', value: '05:15' },
    { label: '05:30', value: '05:30' },
    { label: '05:45', value: '05:45' },
    { label: '06:00', value: '06:00' },
    { label: '06:15', value: '06:15' },
    { label: '06:30', value: '06:30' },
    { label: '06:45', value: '06:45' },
    { label: '07:00', value: '07:00' },
    { label: '07:15', value: '07:15' },
    { label: '07:30', value: '07:30' },
    { label: '07:45', value: '07:45' },
    { label: '08:00', value: '08:00' },
    { label: '08:15', value: '08:15' },
    { label: '08:30', value: '08:30' },
    { label: '08:45', value: '08:45' },
    { label: '09:00', value: '09:00' },
    { label: '09:15', value: '09:15' },
    { label: '09:30', value: '09:30' },
    { label: '09:45', value: '09:45' },
    { label: '10:00', value: '10:00' },
    { label: '10:15', value: '10:15' },
    { label: '10:30', value: '10:30' },
    { label: '10:45', value: '10:45' },
    { label: '11:00', value: '11:00' },
    { label: '11:15', value: '11:15' },
    { label: '11:30', value: '11:30' },
    { label: '11:45', value: '11:45' },
    { label: '12:00', value: '12:00' },
    { label: '12:15', value: '12:15' },
    { label: '12:30', value: '12:30' },
    { label: '12:45', value: '12:45' },
    { label: '13:00', value: '13:00' },
    { label: '13:15', value: '13:15' },
    { label: '13:30', value: '13:30' },
    { label: '13:45', value: '13:45' },
    { label: '14:00', value: '14:00' },
    { label: '14:15', value: '14:15' },
    { label: '14:30', value: '14:30' },
    { label: '14:45', value: '14:45' },
    { label: '15:00', value: '15:00' },
    { label: '15:15', value: '15:15' },
    { label: '15:30', value: '15:30' },
    { label: '15:45', value: '15:45' },
    { label: '16:00', value: '16:00' },
    { label: '16:15', value: '16:15' },
    { label: '16:30', value: '16:30' },
    { label: '16:45', value: '16:45' },
    { label: '17:00', value: '17:00' },
    { label: '17:15', value: '17:15' },
    { label: '17:30', value: '17:30' },
    { label: '17:45', value: '17:45' },
    { label: '18:00', value: '18:00' },
    { label: '18:15', value: '18:15' },
    { label: '18:30', value: '18:30' },
    { label: '18:45', value: '18:45' },
    { label: '19:00', value: '19:00' },
    { label: '19:15', value: '19:15' },
    { label: '19:30', value: '19:30' },
    { label: '19:45', value: '19:45' },
    { label: '20:00', value: '20:00' },
    { label: '20:15', value: '20:15' },
    { label: '20:30', value: '20:30' },
    { label: '20:45', value: '20:45' },
    { label: '21:00', value: '21:00' },
    { label: '21:15', value: '21:15' },
    { label: '21:30', value: '21:30' },
    { label: '21:45', value: '21:45' },
    { label: '22:00', value: '22:00' },
    { label: '22:15', value: '22:15' },
    { label: '22:30', value: '22:30' },
    { label: '22:45', value: '22:45' },
    { label: '23:00', value: '23:00' },
    { label: '23:15', value: '23:15' },
    { label: '23:30', value: '23:30' },
    { label: '23:45', value: '23:45' }
  ]

  const partnerOptions = [
    { label: 'CAF Drôme', value: '0' },
    { label: 'Association 77', value: '1' },
    { label: 'Secours Populaire', value: '2' },
    { label: 'Emmaüs France', value: '3' },
    { label: 'Restos du Cœur', value: '4' },
    { label: 'Croix-Rouge Française', value: '5' },
    { label: 'France Bénévolat', value: '6' },
    { label: 'AFEV', value: '7' },
    { label: 'UNICEF France', value: '8' },
    { label: 'Secours Catholique', value: '9' }
  ]

  const ageConditionOptions = [
    { label: 'Limité aux plus de ...', value: 'minAge' },
    { label: 'Limité aux moins de ...', value: 'maxAge' }
  ]
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
