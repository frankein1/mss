<template>
  <div class="beneficiarydetailshistoryactions_container">
    <span class="fr-text--bold fr-mr-2w"> Créer :</span>
    <ul
      class="fr-btns-group fr-btns-group--inline-sm fr-btns-group--icon-left benficiarydetailshistoryactions_btns-group"
    >
      <li>
        <NuxtLink
          :to="RoutePath.AppBeneficiaryFollowupAdd(beneficiaryId)"
          class="fr-btn fr-icon-file-add-line followup-btn"
          title="Ajouter une synthèse d'entretien"
          target="_self"
        >
          Synthèse d'entretien
        </NuxtLink>
      </li>
      <li v-if="permissions?.create.helpRequest">
        <NuxtLink
          :to="
            RoutePath.AppBeneficiaryHelpRequestAdd(
              beneficiaryId,
              HelpRequestSubject.Other
            )
          "
          class="fr-btn fr-icon-file-add-line help-request-btn"
          title="Instruire un dossier"
          target="_self"
        >
          Instruction de dossier
        </NuxtLink>
      </li>
      <li class="mesdroitssociaux-btn-container">
        <NuxtLink
          to="https://www.mesdroitssociaux.gouv.fr/dd1pnds-ria/#destination/simu-foyer"
          class="fr-link"
          title="Accéder à l'outil de simulation de droits sociaux mesdroitssociaux.gouv.fr - nouvelle fenêtre"
          target="_blank"
          rel="noopener external"
        >
          Simulation de droits sociaux
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { HelpRequestSubject } from '@prisma/client'
  import { RoutePath } from '~/utils/routing'
  import { BeneficiaryPermissions } from '~/server/security'

  defineProps<{
    beneficiaryId: string
    permissions: BeneficiaryPermissions | undefined
  }>()
</script>

<style scoped lang="scss">
  .beneficiarydetailshistoryactions_container {
    display: flex;
    align-items: center;
  }

  .benficiarydetailshistoryactions_btns-group {
    flex: 1;

    .fr-btn {
      margin-bottom: 0;
    }
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
