<template>
  <div class="fr-grid-row fr-grid-row--gutters attendees-container">
    <div class="fr-col-12 fr-mt-3w">
      <div class="registration">
        <img
          src="/pictograms/tickets.svg"
          alt=""
        />
        <p class="registration-count">
          <span class="cont-emphasis">{{ attendees.length }}</span> inscriptions
        </p>
      </div>
    </div>
    <div class="fr-col-12">
      <ul class="attendee-list">
        <li
          v-for="(attendee, idx) in attendees"
          :key="idx"
        >
          <WorkshopAttendeeItem :attendee="attendee" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { WorkshopDetails } from '~/types/workshop'
  import WorkshopAttendeeItem from './WorkshopAttendeeItem.vue'
  import { GetBeneficiaryGeneral } from '~/types/beneficiary'

  defineProps<{
    workshop: WorkshopDetails
  }>()

  const attendees: GetBeneficiaryGeneral[] = [
    {
      // id: '5a055c3b-9e39-493d-bc4d-c59a0de8947d',
      title: null,
      usualName: 'COURSOR',
      birthName: 'BLANKETT',
      firstName: 'Gisèle',
      birthDate: new Date('1987-08-21T00:00:00.000Z'),
      birthPlace: null,
      deathDate: null,
      gender: null,
      nationality: null,
      numeroPegase: null,
      accommodationMode: 'ThirdPerson',
      accommodationName: null,
      accommodationZone: null,
      accommodationAdditionalInformation: null,
      addressComplement: null,
      street: '3 rue du 8 mai 1945',
      zipcode: '93100',
      city: 'Montreuil',
      region: null,
      department: null,
      qpv: false,
      noPhone: false,
      phone1: null,
      phone2: null,
      email: 'cblankett8@histats.com',
      mobility: null,
      status: 'Active',
      additionalInformation: null
    }
  ]
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

      span {
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
