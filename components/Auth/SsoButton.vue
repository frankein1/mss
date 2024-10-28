<template>
  <div class="sso">
    <ProConnectButton />

    <AtomAlert
      title-tag="h2"
      class="fr-mt-6w"
      :alert-type="AlertType.Info"
      message="Inclusion Connect devient ProConnect"
    >
      <template #detailedMessage>
        <section>
          <h3>
            Pour les utilisateurs existants de Mon Suivi Social, utilisant
            précédemment Inclusion Connect :
          </h3>
          <p>
            Vous pouvez dès maintenant utiliser ProConnect à la place
            d'Inclusion Connect.
          </p>

          <p>
            <strong
              >⚠️ Attention : à partir du 30 novembre 2024, vous ne pourrez plus
              vous connecter avec Inclusion Connect,</strong
            >
            nous vous encourageons donc à ne pas attendre cette date !
          </p>

          <p>
            <NuxtLink to="mailto:support@monsuivisocial.incubateur.anct.gouv.fr"
              >Contactez-nous</NuxtLink
            >
            si vous rencontrez des difficultés avec votre numéro de SIRET ou
            rapprochez-vous de votre responsable de structure.
          </p>

          <p class="fr-mt-3w"><InclusionConnectButton /></p>
        </section>

        <section>
          <h3>
            Pour les nouveaux utilisateurs de Mon Suivi Social, n’ayant jamais
            utilisé Inclusion Connect auparavant :
          </h3>

          <p>Vous ne pourrez vous connecter qu’avec ProConnect.</p>

          <p>
            Si vous avez des difficultés pour vous authentifier,
            <NuxtLink
              external
              target="_blank"
              to="https://agentconnect.crisp.help/fr/article/je-nai-plus-acces-a-mon-organisation-1rt72xx/"
              >retrouvez la FAQ de ProConnect</NuxtLink
            >
            ou
            <NuxtLink to="mailto:support@monsuivisocial.incubateur.anct.gouv.fr"
              >contactez-nous</NuxtLink
            >.
          </p>
        </section>
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

  h3 {
    font-size: unset;
    margin-top: 1.3rem;
  }
</style>
