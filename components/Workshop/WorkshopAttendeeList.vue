<template>
  <div class="fr-grid-row fr-grid-row--gutters attendees-container">
    <div class="fr-col-12 fr-mt-3w">
      <div class="registration">
        <img
          src="/pictograms/tickets.svg"
          alt=""
        />
        <p class="registration-count">
          <span class="cont-emphasis">{{ attendees.length }}</span>
          inscription<span v-if="attendees.length > 1">s</span>
        </p>
      </div>
    </div>
    <div class="fr-col-12">
      <ul
        v-if="attendees.length"
        class="attendee-list"
      >
        <li
          v-for="(attendee, idx) in attendees"
          :key="idx"
          class="fr-mb-1w"
        >
          <WorkshopAttendeeItem :attendee="attendee" />
        </li>
      </ul>
      <WorkshopAttendeeEmpty v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { WorkshopWithAttendeesDetails } from '~/types/workshop'
  import WorkshopAttendeeItem from './WorkshopAttendeeItem.vue'

  const { workshop } = defineProps<{
    workshop: WorkshopWithAttendeesDetails
  }>()

  const attendees = computed(() => {
    return workshop.workshopAttendees
  })
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .registration {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;

    p {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;

      .cont-emphasis {
        font-size: 2.25rem;
        color: var(--primary);
      }
    }
  }

  .attendee-list {
    --ul-start: 0;
    --xl-block: 0;
    --ul-type: none;

    list-style-type: var(--ul-type);
    padding-inline-start: var(--ul-start);
  }
</style>
