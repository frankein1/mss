<template>
  <h1>{{ title }}</h1>
  <h2 class="fr-mb-1w">
    Entretien avec {{ beneficiaryFirstname }} {{ beneficiaryUsualname }}
  </h2>
  <p
    v-if="date"
    class="fr-mb-1w"
  >
    Saisi le : {{ date }}
  </p>
  <SocialSupportBadgesGroup
    v-if="status"
    :status="status"
  />
  <hr class="fr-mt-4w" />
</template>

<script setup lang="ts">
  import { SocialSupportStatus } from '@prisma/client'

  defineProps<{
    title: string
    beneficiaryFirstname: string | null
    beneficiaryUsualname: string | null
    date: string | null
    status: SocialSupportStatus
  }>()
</script>
