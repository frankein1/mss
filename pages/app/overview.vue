<template>
  <div class="fr-container fr-p-5w">
    <TheHeader :title="title" />
    <BeneficiarySearchbar class="fr-mt-3w" />
    <!-- <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
      <NotificationList />
    </div> -->
  </div>
</template>

<script lang="ts" setup>
  import BeneficiarySearchbar from '~/components/beneficiary/BeneficiarySearchbar.vue'
  import { useAuthStore } from '~/store/auth'

  const { userName: title } = useAuthStore()
</script>
