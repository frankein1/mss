<template>
  <li v-if="appointment?.durationInMin">
    <span class="information-label">Durée :</span>
    {{ appointment.durationInMin }} min
  </li>
  <li v-if="appointment.place">
    <span class="information-label">Lieu :</span> {{ appointment.place }}
  </li>
</template>

<script setup lang="ts">
  import { AppointmentData } from './types'

  defineProps<{ appointment: AppointmentData }>()
</script>
