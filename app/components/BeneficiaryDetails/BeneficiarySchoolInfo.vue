<template>
  <div class="fr-pb-2w">
    <div class="field-label">{{ beneficiaryFieldLabels.schoolUai }}&nbsp;:</div>
    <p class="fr-mb-0">{{ school.name }}</p>
    <ul class="school-details">
      <li v-if="school.address">
        Adresse : {{ school.address }}, {{ school.zipcode }} {{ school.city }}
      </li>
      <li>Type : {{ schoolTypeLabels[school.type] }}</li>
      <li>Académie : {{ school.academy }}</li>
      <li v-if="school.status !== SchoolStatus.OUVERT">
        {{ schoolStatusLabels[school.status] }}
      </li>
      <li v-if="school.repClassification">
        Classification REP :
        <span class="fr-badge fr-badge--new fr-badge--no-icon">{{
          repClassificationLabels[school.repClassification]
        }}</span>
      </li>
      <li v-if="school.qpvCode && school.qpvName">
        QPV : {{ school.qpvCode }} – {{ school.qpvName }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import type { RepClassification, SchoolType } from '@prisma/client'
  import { SchoolStatus } from '@prisma/client'
  import { beneficiaryFieldLabels } from '~~/client/labels/beneficiary.labels'
  import {
    repClassificationLabels,
    schoolStatusLabels,
    schoolTypeLabels
  } from '~~/client/labels/school.labels'

  defineProps<{
    school: {
      name: string
      type: SchoolType
      address: string | null
      city: string
      zipcode: string
      academy: string
      status: SchoolStatus
      repClassification: RepClassification | null
      qpvCode: string | null
      qpvName: string | null
    }
  }>()
</script>

<style scoped lang="scss">
  .school-details {
    list-style: none;
    padding: 0;
    margin: 0;

    dd,
    dt,
    li {
      padding-bottom: 0;
    }
  }
</style>
