<template>
  <h1>{{ title }}</h1>
  <h2 class="fr-mb-1w">
    Entretien avec {{ beneficiaryFirstname }} {{ beneficiaryUsualname }}
  </h2>
  <p
    v-if="date"
    class="fr-mb-1w"
  >
    Saisi le {{ date
    }}<span v-if="createdBy">
      par {{ createdBy.firstName }} {{ createdBy.lastName }}
    </span>
  </p>
  <p
    v-if="lastUpdatedBy && updated"
    class="fr-mb-1w"
  >
    Modifié le {{ updated }} par {{ lastUpdatedBy.firstName }}
    {{ lastUpdatedBy.lastName }}
  </p>
  <SocialSupportBadgesGroup
    v-if="status"
    :status="status"
  />
  <hr class="fr-mt-4w" />
</template>

<script setup lang="ts">
  import type { SocialSupportStatus } from '@prisma/client'

  defineProps<{
    title: string
    beneficiaryFirstname: string | null
    beneficiaryUsualname: string | null
    date: string | null
    updated: string | null
    createdBy?: { id: string; firstName: string; lastName: string } | null
    lastUpdatedBy?: { id: string; firstName: string; lastName: string } | null
    status: SocialSupportStatus
  }>()
</script>
