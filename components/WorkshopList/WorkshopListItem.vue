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
      <div class="item-description">
        <p
          role="heading"
          aria-level="4"
          class="title"
        >
          {{ title }}
        </p>
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
      <div class="item-arrow">→</div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
  import type { WorkshopsPageItem } from './types'
  import { routes } from '~/utils/routes'
  import { FilterWorkshopTimeDirection } from '~/utils/constants/filters'
  import { BadgeColor } from '~/types/badge'
  import { WorkshopAttendeeListType } from '@prisma/client'

  const { workshop, timeDirection } = defineProps<{
    workshop: WorkshopsPageItem
    timeDirection: FilterWorkshopTimeDirection
  }>()
  const letterDay = computed(() => {
    return formatDate(workshop.date, 'ddd').toUpperCase().slice(0, -1)
  })
  const numberDay = computed(() => {
    return formatDate(workshop.date, 'DD')
  })
  const title = computed(() => {
    const base = workshop.workshopName.name
    const suffix = workshop.sessionName ? ' – ' + workshop.sessionName : ''
    return base + suffix
  })
  const hour = computed(() => {
    if (!workshop.startTime) {
      return
    }
    const hour = workshop.startTime.split(':')[0]
    const minute = workshop.startTime?.split(':')[1]
    return hour + 'h' + minute
  })

  const plural = (n: number, w: string) => (n > 1 ? `${n} ${w}s` : `${n} ${w}`)
  const registrations = computed(() => {
    if (!workshop.attendeeLimit) {
      return plural(workshop._count.workshopAttendees, 'inscription')
    }
    const mainAttendeesCount = workshop.workshopAttendees.filter(
      a => a.listType === WorkshopAttendeeListType.Main
    ).length
    return (
      (mainAttendeesCount >= workshop.attendeeLimit ? 'Complet : ' : '') +
      mainAttendeesCount +
      ' / ' +
      plural(workshop.attendeeLimit, 'inscription')
    )
  })

  const statusBadge = computed(() => {
    if (timeDirection === FilterWorkshopTimeDirection.Future) {
      return null
    }
    const emptyAttendances = workshop.workshopAttendees.filter(
      a => a.attendance === null
    )
    if (
      emptyAttendances.length === workshop.workshopAttendees.length ||
      workshop.workshopAttendees.length === 0
    ) {
      return {
        color: BadgeColor.Purple,
        label: 'À remplir'
      }
    }
    if (emptyAttendances.length === 0) {
      return {
        color: BadgeColor.Green,
        label: 'Rempli'
      }
    }
    return {
      color: BadgeColor.Purple,
      label: 'Partiellement rempli'
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

    .item-description {
      grid-area: 1 / 2 / 2 / 4;

      @include dsfr-media-query.respond-from('md') {
        grid-area: 1 / 2 / 3 / 3;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      p.title {
        color: var(--primary);
        font-size: 1.25rem;
        font-weight: 700;
      }

      .item-hours {
        display: flex;
        overflow: auto;
        flex-wrap: wrap;
        gap: 0.25rem 0.75rem;
        margin-top: 0.5rem;

        p {
          font-weight: 400;
          color: var(--text-default-grey);
          text-wrap: nowrap;
          font-size: 0.875rem;
        }

        .icon::before {
          --icon-size: 1.25em;
        }
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
