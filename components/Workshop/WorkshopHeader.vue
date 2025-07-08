<template>
  <div class="header-wrapper">
    <h1>{{ workshop.workshopName.name }}</h1>
    <h2 v-if="workshop.sessionName">{{ workshop.sessionName }}</h2>
    <p class="date-details">
      <i class="ri-calendar-event-line fr-mr-2w"></i>{{ dateDetails }}
    </p>
    <div class="hours-location-wrapper">
      <p
        v-if="duration"
        class="duration"
      >
        <i class="ri-hourglass-2-line"></i>{{ duration }}
      </p>
      <p
        v-if="workshop.location"
        class="location"
      >
        <i class="ri-map-pin-2-line"></i>{{ workshop.location }}
      </p>
    </div>
    <p
      v-if="workshop.host"
      class="host fr-text--sm"
    >
      Personne intervenante : {{ workshop.host }}
    </p>
    <p
      v-if="workshop.description"
      class="description fr-text--sm"
    >
      {{ workshop.description }}
    </p>
    <div class="action-wrapper fr-mt-2w">
      <!-- TODO: create edit page -->
      <NuxtLink
        :to="routes.workshop.AppWorkshopAdd.path()"
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-edit-line fr-mb-0 edit-btn"
      >
        Modifier
      </NuxtLink>

      <button
        aria-describedby="duplicate-tooltip"
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-mb-0 edit-btn"
        type="button"
        :disabled="true"
      >
        <i class="ri-file-copy-line"></i>
        Dupliquer
      </button>
      <span
        id="duplicate-tooltip"
        class="fr-tooltip fr-placement"
        role="tooltip"
        >Fonctionnalité à venir</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs'
  import { WorkshopDetails } from '~/types/workshop'
  import { routes } from '~/utils/routes'
  import { capitalizeFirstLetter } from '~/utils/text/capitalizeFirstLetter'

  const props = defineProps<{
    workshop: WorkshopDetails
  }>()

  const dateDetails = computed(() => {
    let formatedDate = capitalizeFirstLetter(
      dayjs(props.workshop.date).format('dddd DD MMMM YYYY')
    )
    if (props.workshop.startTime) {
      formatedDate =
        formatedDate +
        ' à ' +
        props.workshop.startTime.replace(':', 'h').replace('h00', 'h')
    }
    return formatedDate
  })

  const duration = computed(() => {
    if (!props.workshop.startTime || !props.workshop.endTime) {
      return null
    }
    const end =
      props.workshop.date.toDateString() + ' ' + props.workshop.endTime
    const start =
      props.workshop.date.toDateString() + ' ' + props.workshop.startTime
    const diff = dayjs(end, 'HH:mm').diff(dayjs(start, 'HH:mm'), 'hour')
    return diff + ' h'
  })
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .header-wrapper,
  .action-wrapper,
  .hours-location-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hours-location-wrapper {
    flex-direction: column;

    @include dsfr-media-query.respond-from('sm') {
      gap: 1rem;
      flex-direction: row;
    }
  }

  .action-wrapper {
    gap: 1rem;
  }

  h1,
  h2 {
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 0.5em;
    text-align: center;
  }

  p {
    margin-bottom: 0.5em;
    text-align: center;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 1.25rem;
  }

  .date-details {
    font-weight: 700;
    font-size: 1.25rem;
  }

  .timing,
  .location {
    font-weight: 400;
    font-size: 1rem;
  }

  .header-wrapper {
    flex-direction: column;
  }

  .ri-file-copy-line {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23929292'%3E%3Cpath d='M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z'%3E%3C/path%3E%3C/svg%3E");
  }

  @mixin icon {
    font-size: inherit;
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-bottom: -0.25em;
    margin-right: 0.25em;
  }

  .ri-calendar-event-line {
    @include icon;

    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fa794a'%3E%3Cpath d='M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM11 13V17H6V13H11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z'%3E%3C/path%3E%3C/svg%3E");
  }

  .ri-map-pin-2-line {
    @include icon;

    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fa794a'%3E%3Cpath d='M12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995L16.9497 15.9497ZM12 13C10.8954 13 10 12.1046 10 11C10 9.89543 10.8954 9 12 9C13.1046 9 14 9.89543 14 11C14 12.1046 13.1046 13 12 13Z'%3E%3C/path%3E%3C/svg%3E");
  }

  .ri-hourglass-2-line {
    @include icon;

    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fa794a'%3E%3Cpath d='M4 2H20V6.45994L13.5366 12L20 17.5401V22H4V17.5401L10.4634 12L4 6.45994V2ZM12 10.6829L18 5.54007V4H6V5.54007L12 10.6829ZM12 13.3171L6 18.4599V20H18V18.4599L12 13.3171Z'%3E%3C/path%3E%3C/svg%3E");
  }
</style>
