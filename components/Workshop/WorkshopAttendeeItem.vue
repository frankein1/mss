<template>
  <div class="item">
    <div class="name-options">
      <p class="fr-text--bold">
        {{ attendeeName }}
        <span
          v-if="attendee.type === WorkshopAttendeeType.Beneficiary"
          :aria-describedby="BENEFICIARY_TOOLTIP_ID"
          class="fr-icon--sm fr-icon-user-line fr-ml-1v"
          aria-hidden="true"
        >
        </span>
        <span
          :id="BENEFICIARY_TOOLTIP_ID"
          class="fr-tooltip fr-placement"
          role="tooltip"
          >Bénéficiaire enregistré sur Mon Suivi Social
        </span>
      </p>
      <AtomDropdown
        label="Options"
        :menus="menus"
        dropdown-btn-class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-right fr-icon-more-fill"
        :align-right="true"
      />
    </div>
    <div class="info">
      <template
        v-if="
          attendeeDetails &&
          (attendeeDetails.phone1 ||
            attendeeDetails.email ||
            attendeeDetails.birthDate)
        "
      >
        <p
          v-if="attendee.beneficiary?.phone1"
          class="fr-text--sm telephone"
        >
          <span
            class="fr-icon--sm fr-icon-phone-line"
            aria-hidden="true"
          ></span>
          {{ attendeeDetails.phone1 }}
        </p>
        <p
          v-if="attendeeDetails.email"
          class="fr-text--sm email"
        >
          <span
            class="fr-icon--sm fr-icon-mail-line"
            aria-hidden="true"
          ></span>
          {{ attendeeDetails.email }}
        </p>
        <p
          v-if="attendeeDetails.birthDate"
          class="fr-text--sm age"
        >
          <span
            class="ri-cake-line"
            aria-hidden="true"
          >
          </span>
          {{ calculateAge(attendeeDetails.birthDate) }}&nbsp;ans
        </p>
      </template>
    </div>
    <div
      v-if="attendeeAddress"
      class="address"
    >
      <p class="fr-text--sm">
        <span
          class="fr-icon--sm fr-icon-map-pin-2-line"
          aria-hidden="true"
        ></span>
        {{ attendeeAddress }}
      </p>
    </div>
    <div
      v-if="attendee.comment"
      class="comments"
    >
      <p class="fr-text--sm">
        <span
          class="fr-icon--sm fr-icon-message-2-line"
          aria-hidden="true"
        ></span>
        {{ attendee.comment }}
      </p>
    </div>
    <div class="presence">
      <VeeRadioButtons
        :aria-describedby="ATTENDANCE_TOOLTIP_ID"
        name="presence"
        class="radio-buttons fr-mb-0"
        :options="[
          { value: 'present', label: 'Présence', disabled: true },
          { value: 'absent', label: 'Absence', disabled: true },
          { value: 'excused', label: 'Absence excusée', disabled: true }
        ]"
        label="Présence"
        no-label
        inline
      />
      <span
        :id="ATTENDANCE_TOOLTIP_ID"
        class="fr-tooltip fr-placement"
        role="tooltip"
        >Fonctionnalité à venir</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Menu } from '~/types/menu'
  import { WorkshopAttendee } from '~/types/workshop'
  import { WorkshopAttendeeType } from '@prisma/client'

  const props = defineProps<{
    attendee: WorkshopAttendee
  }>()

  const emit = defineEmits<{
    deleteAttendee: [id: string]
  }>()

  const BENEFICIARY_TOOLTIP_ID = 'beneficiary-tooltip-' + useId()
  const ATTENDANCE_TOOLTIP_ID = 'attendance-tooltip-' + useId()

  const attendeeDetails = computed(() => {
    if (props.attendee.beneficiary) {
      return props.attendee.beneficiary
    }
    return null
  })

  const attendeeName = computed(() => {
    if (attendeeDetails.value == null) {
      return ''
    }
    return formatBeneficiaryName(attendeeDetails.value)
  })

  const attendeeAddress = computed(() => {
    if (
      !attendeeDetails.value ||
      (!attendeeDetails.value?.street &&
        !attendeeDetails.value?.zipcode &&
        !attendeeDetails.value?.city)
    ) {
      return null
    }
    return formatAddress({
      street: attendeeDetails.value.street,
      zipcode: attendeeDetails.value.zipcode,
      city: attendeeDetails.value.city,
      region: null
    })
  })

  // Option button dropdown
  const menus: Menu[] = [
    {
      label: "Retirer de l'atelier",
      callback: () => emit('deleteAttendee', props.attendee.id),
      icon: 'ri-user-unfollow-line'
    }
  ]
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  p {
    margin: 0;
  }

  .item {
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-template-rows: repeat(5, auto);
    grid-gap: 0.25rem 1.5rem;
    border: 1px solid var(--border-default-grey);
    border-left: 3px solid var(--color-workshop);
    border-radius: 8px;
    background-color: #fff;
    padding: 1rem;
  }

  .name-options {
    grid-area: 1 / 1 / 2 / 3;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @include dsfr-media-query.respond-from('md') {
      grid-area: 1 / 1 / 3 / 3;
    }
  }

  .info {
    grid-area: 2 / 1 / 3 / 3;
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    gap: 0.75rem;

    p:not(:last-child)::after {
      content: '|';
      margin-left: 0.5em;
    }

    @include dsfr-media-query.respond-from('md') {
      grid-area: 3 / 1 / 4 / 2;
    }
  }

  .address {
    grid-area: 3 / 1 / 4 / 3;

    @include dsfr-media-query.respond-from('md') {
      grid-area: 4 / 1 / 5 / 2;
    }
  }

  .comments {
    grid-area: 4 / 1 / 5 / 3;

    @include dsfr-media-query.respond-from('md') {
      grid-area: 5 / 1 / 6 / 2;
    }
  }

  .presence {
    grid-area: 5 / 1 / 6 / 3;

    @include dsfr-media-query.respond-from('md') {
      grid-area: 3 / 2 / 6 / 3;
      align-self: center;

      :deep(.fr-fieldset) {
        justify-content: flex-end;
      }
    }
  }

  // icons
  :deep(.fr-icon-more-fill::after) {
    transform: rotate(90deg);
  }

  .ri-cake-line {
    --icon-size: 1rem;

    content: '';
    background-color: currentcolor;
    display: inline-block;
    height: var(--icon-size);
    /* stylelint-disable property-no-vendor-prefix */
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    vertical-align: calc((0.75em - var(--icon-size)) * 0.5);
    width: var(--icon-size);
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M13 6.99993V10.9999L20 10.9999C20.5523 10.9999 21 11.4476 21 11.9999V19.9999L23 19.9999V21.9999H1V19.9999L3 19.9999V11.9999C3 11.4476 3.44772 10.9999 4 10.9999L11 10.9999V6.99993H13ZM19 12.9999H5V19.9999H19V12.9999ZM13.8301 0.401855C14.6586 1.83673 14.1669 3.6715 12.7321 4.49993L11 5.49993C10.1716 4.06505 10.6632 2.23028 12.0981 1.40186L13.8301 0.401855Z'%3E%3C/path%3E%3C/svg%3E");
  }

  // Dropmenu
  :deep(.ri-user-unfollow-line) {
    min-width: max-content;
  }

  :deep(.ri-user-unfollow-line::before) {
    --icon-size: 1rem;

    content: '';
    background-color: currentcolor;
    display: inline-block;
    height: var(--icon-size);
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    vertical-align: calc((0.75em - var(--icon-size)) * 0.5);
    width: var(--icon-size);
    margin-right: 0.5em;
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M14 14.252V16.3414C13.3744 16.1203 12.7013 16 12 16C8.68629 16 6 18.6863 6 22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM19 17.5858L21.1213 15.4645L22.5355 16.8787L20.4142 19L22.5355 21.1213L21.1213 22.5355L19 20.4142L16.8787 22.5355L15.4645 21.1213L17.5858 19L15.4645 16.8787L16.8787 15.4645L19 17.5858Z'%3E%3C/path%3E%3C/svg%3E");
  }

  // small radio buttons
  .radio-buttons {
    margin-top: 0;

    @include dsfr-media-query.respond-from('md') {
      grid-area: 3 / 2 / 6 / 3;
      align-self: center;
    }

    :deep(input) {
      height: 1rem;
      width: 1rem;
    }

    :deep(.fr-fieldset__element) {
      margin-bottom: 0;
    }

    :deep(.fr-label) {
      font-size: 1rem;
      line-height: 1rem;
      background-image: radial-gradient(
        transparent 6px,
        var(--border-action-high-blue-france) 7px,
        transparent 8px
      );
      background-position:
        0 50%,
        0 50%;
      background-repeat: no-repeat, no-repeat;
      background-size:
        1.125rem 1.125rem,
        1.125rem 1.125rem;
      padding: 0.5rem 0.5rem 0.5rem 1.5rem;
      padding-left: 1.5rem;
    }

    :deep(input[type='radio']:checked + label) {
      background-image:
        radial-gradient(
          transparent 6px,
          var(--border-active-blue-france) 7px,
          transparent 8px
        ),
        radial-gradient(
          var(--background-active-blue-france) 3px,
          transparent 4px
        );
    }

    :deep(input[type='radio']:disabled + label) {
      background-image: radial-gradient(
        transparent 6px,
        var(--background-disabled-grey) 7px,
        transparent 8px
      );
    }

    :deep(input[type='radio'] + label::before) {
      height: 1rem;
      width: 1rem;
      margin-left: -1.45rem;
      top: 0.5rem;
    }
  }
</style>
