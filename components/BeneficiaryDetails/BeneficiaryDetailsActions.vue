<template>
  <ul
    class="fr-btns-group fr-btns-group--inline-sm fr-btns-group--icon-left benficiarydetailsactions_btns-group"
  >
    <li>
      <NuxtLink
        :to="`${RoutePath.BeneficiaryFollowupAdd(beneficiaryId)}`"
        class="fr-btn fr-icon-file-add-line followup-btn"
        title="Ajouter une synthèse d'entretien"
        target="_self"
      >
        Synthèse d'entretien
      </NuxtLink>
    </li>
    <li v-if="canCreateHelpRequest">
      <NuxtLink
        :to="`${RoutePath.BeneficiaryHelpRequestAdd(beneficiaryId)}`"
        class="fr-btn fr-icon-file-add-line help-request-btn"
        title="Ajouter une instruction de demande d'aide"
        target="_self"
      >
        Demande d'aide
      </NuxtLink>
    </li>
    <li class="mesdroitssociaux-btn-container">
      <NuxtLink
        to="https://www.mesdroitssociaux.gouv.fr/dd1pnds-ria/#destination/simu-foyer"
        class="fr-link"
        title="Nouvel onglet - Accéder à l'outil de simulation de droits sociaux mesdroitssociaux.gouv.fr"
        target="_blank"
      >
        Simulation de droits sociaux
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { RoutePath } from '~/utils/routing'
  import { canCreateHelpRequest as canCreateHelpRequestRule } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { GetBeneficiaryOutput } from '~/server/routers'

  const authStore = useAuthStore()

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
  }>()

  const beneficiaryId = computed(() => props.beneficiary.id)

  const canCreateHelpRequest = computed(() =>
    canCreateHelpRequestRule(authStore.getAuthUser, props.beneficiary)
  )
</script>

<style scoped lang="scss">
  .benficiarydetailsactions_btns-group .fr-btn {
    margin-bottom: 0;
  }

  .followup-btn {
    background-color: var(--color-followup);

    &:hover {
      background-color: var(--color-followup-hover);
    }
  }

  .help-request-btn {
    background-color: var(--color-help-request);

    &:hover {
      background-color: var(--color-help-request-hover);
    }
  }

  .mesdroitssociaux-btn-container {
    align-items: center;
    margin-right: 0.5rem;
    margin-left: auto;

    > .fr-link {
      height: fit-content;
    }
  }
</style>
