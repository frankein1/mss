<template>
  <NuxtLink
    :to="routes.workshop.AppWorkshop.path(workshop.id)"
    class="workshop-item-link"
  >
    <div class="workshop-item">
      <div class="item-date">
        <p class="day">{{ letterDay }}</p>
        <p class="day-number">{{ numberDay }}</p>
      </div>
      <div class="item-name">
        <p>{{ title }}</p>
      </div>
      <div
        v-if="hour || workshop.location"
        class="item-hours"
      >
        <p v-if="hour">
          <span
            aria-hidden="true"
            class="icon fr-icon-time-line"
          ></span>
          {{ hour }}
        </p>
        <p v-if="workshop.location">
          <span
            class="icon fr-icon-map-pin-2-line"
            aria-hidden="true"
          ></span
          >{{ workshop.location }}
        </p>
      </div>
      <div class="item-registrations">
        <AtomBadge
          v-if="statusBadge"
          small
          :color="statusBadge.color"
          >{{ statusBadge.label }}</AtomBadge
        >
        <p
          v-else
          class="registration"
        >
          {{ registrations }}
        </p>
      </div>
      <div class="item-arrow">
        <NuxtLink :to="routes.workshop.AppWorkshop.path(workshop.id)"
          >→</NuxtLink
        >
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs'
  import { WorkshopsPageItem } from '~/server/services/workshops/getPage.service'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    workshop: WorkshopsPageItem
  }>()
  const letterDay = computed(() => {
    const date = dayjs(new Date(props.workshop.date))
    return date.format('ddd').toUpperCase().slice(0, -1)
  })
  const numberDay = computed(() => {
    const date = dayjs(new Date(props.workshop.date))
    return date.format('DD')
  })
  const title = computed(() => {
    const base = props.workshop.name
    const suffix = props.workshop.sessionName
      ? ' – ' + props.workshop.sessionName
      : ''
    return base + suffix
  })
  const hour = computed(() => {
    if (!props.workshop.startTime) {
      return
    }
    const hour = props.workshop.startTime.split(':')[0]
    const minute = props.workshop.startTime?.split(':')[1]
    return hour + 'h' + minute
  })

  // TODO (émargement/sign-in)
  // if workshop date is not yet passed status badge is null
  // instead, display registration text
  const registrations = computed(() => '0 inscription(s)')

  const statusBadge = computed(() => {
    if (props.workshop.date > new Date()) {
      return null
    }
    return {
      color: 'purple' as
        | 'purple'
        | 'grey'
        | 'green'
        | 'red'
        | 'yellow'
        | 'bue'
        | 'orange'
        | undefined,
      label: 'À remplir'
    }
  })
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  a.workshop-item-link {
    &:focus-visible {
      outline-style: auto;
    }
  }

  .workshop-item {
    background-color: #fff;
    border: 1px solid var(--border-default-grey);
    border-bottom: 4px solid var(--color-workshop);
    border-radius: 0.5rem 0.5rem 0 0;
    padding: 1rem;
    margin-bottom: 1rem;

    &:hover {
      background-color: var(--color-workshop-light);
    }

    // grid
    display: grid;
    grid-template-columns: fit-content(100%) auto fit-content(100%);
    grid-template-rows: repeat(3, auto);
    grid-gap: 0.5rem 1rem;

    @include dsfr-media-query.respond-from('md') {
      // grid
      grid-template-columns:
        auto 1fr fit-content(100%)
        fit-content(100%);
      grid-template-rows: repeat(2, auto);
    }

    p {
      margin: 0;
    }

    .item-date {
      grid-area: 1 / 1 / 4 / 2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-right: 1rem;
      border-right: 1px solid var(--border-default-grey);
      max-width: fit-content;

      @include dsfr-media-query.respond-from('md') {
        grid-area: 1 / 1 / 3 / 2;
        padding: 0 2rem 0 1rem;
      }

      .day {
        text-transform: uppercase;
        font-weight: 400;
      }

      .day-number {
        color: var(--color-workshop);
        font-size: 1.75rem;
        font-weight: 700;
      }
    }

    .item-name {
      grid-area: 1 / 2 / 2 / 4;

      @include dsfr-media-query.respond-from('md') {
        grid-area: 1 / 2 / 2 / 5;
      }

      p {
        color: var(--primary);
        font-size: 1.25rem;
        font-weight: 700;
      }
    }

    .item-hours {
      grid-area: 2 / 2 / 3 / 4;
      display: flex;
      overflow: auto;
      flex-wrap: nowrap;
      gap: 0.75rem;

      @include dsfr-media-query.respond-from('md') {
        grid-area: 2 / 2 / 3 / 3;
      }

      p {
        text-wrap: nowrap;
        font-size: 0.875rem;
      }

      .icon::before {
        --icon-size: 1.25em;
      }
    }

    .item-registrations {
      grid-area: 3 / 2 / 4 / 3;

      @include dsfr-media-query.respond-from('md') {
        max-width: fit-content;
        justify-self: end;
        grid-area: 2 / 3 / 3 / 4;
      }

      p.registration {
        font-size: 0.875rem;
        color: var(--text-mention-grey);
      }
    }

    .item-arrow {
      grid-area: 3 / 3 / 4 / 4;
      color: var(--primary);
      justify-self: end;

      a {
        background: none;
      }

      @include dsfr-media-query.respond-from('md') {
        grid-area: 2 / 4 / 3 / 5;
      }
    }
  }
</style>
