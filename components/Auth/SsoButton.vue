<template>
  <div class="sso">
    <ProConnectButton />

    <AtomAlert
      class="fr-mt-6w"
      :alert-type="AlertType.Info"
      message="Inclusion Connect devient ProConnect"
    >
      <template #detailedMessage>
        <div>
          <p>
            Vous pouvez dès maintenant utiliser ProConnect à la place
            d'Inclusion Connect.
          </p>

          <p>
            L'authentification par Inclusion Connect reste disponible jusqu'au
            30 novembre 2024 pour les utilisateurs existants.
          </p>

          <p>
            Si vous avez des difficultés pour vous authentifier,
            <a href="mailto:monsuivisocial@anct.gouv.fr">contactez-nous</a>.
          </p>

          <p class="fr-mt-3w"><InclusionConnectButton /></p>
        </div>
      </template>
    </AtomAlert>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
</script>

<style scoped>
  .sso {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
