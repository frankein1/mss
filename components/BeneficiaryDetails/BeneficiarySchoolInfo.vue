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
  import { RepClassification, SchoolStatus, SchoolType } from '@prisma/client'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

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

  const schoolTypeLabels: Record<SchoolType, string> = {
    [SchoolType.Ecole]: 'École',
    [SchoolType.College]: 'Collège',
    [SchoolType.Lycee]: 'Lycée',
    [SchoolType.EREA]: 'EREA',
    [SchoolType.MedicoSocial]: 'Médico-social',
    [SchoolType.ServiceAdministratif]: 'Service administratif',
    [SchoolType.InformationOrientation]: 'Information et orientation',
    [SchoolType.Autre]: 'Autre'
  }

  const schoolStatusLabels: Record<SchoolStatus, string> = {
    [SchoolStatus.OUVERT]: 'Ouvert',
    [SchoolStatus.FERME]: 'Fermé',
    [SchoolStatus.AFERMER]: 'À fermer',
    [SchoolStatus.AOUVRIR]: 'À ouvrir'
  }

  const repClassificationLabels: Record<RepClassification, string> = {
    [RepClassification.Rep]: 'REP',
    [RepClassification.RepPlus]: 'REP+'
  }
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
