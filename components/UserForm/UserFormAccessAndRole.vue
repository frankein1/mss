<template>
  <section class="feature-section">
    <div class="title-btn-container">
      <h2 class="fr-h4 text--primary">Accès et rôles</h2>
      <NuxtLink
        class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline"
        to="https://mon-suivi-social.gitbook.io/mon-suivi-social/configuration-au-demarrage/les-roles-utilisateurs"
        target="_blank"
        rel="noopener external"
      >
        En savoir plus sur les rôles
      </NuxtLink>
    </div>

    <p
      v-if="authUserId === userId"
      class="text--muted"
    >
      Vous ne pouvez pas désactiver votre propre accès ni modifier votre rôle.
      Demandez à une autre personne avec le rôle de Responsable de structure de
      le faire pour vous.
    </p>

    <div class="title-btn-container border access-switch">
      <p
        id="status-label"
        class="fr-mb-0 fr-mb-md-4v"
      >
        Accès à Mon Suivi Social
      </p>
      <VeeToggle
        name="status"
        class="fr-mb-0 fr-mb-md-4v"
        labelled-by="status-label"
        :label="userFieldLabels.status"
        no-label
        checked-label
        :disabled="authUserId === userId"
      />
    </div>

    <p>
      Selon le rôle choisi, l’accès à certaines fonctionnalités peut être
      personnalisé pour s’adapter aux besoins spécifiques de chaque structure.
    </p>
    <VeeSelect
      name="role"
      :label="userFieldLabels.role"
      :options="
        update
          ? nonAdminUserRoleKeys.options
          : withEmptyValue(nonAdminUserRoleKeys.options)
      "
      required
      :disabled="authUserId === userId"
    />

    <VeeCheckbox
      name="aidantConnectAuthorisation"
      :label="userFieldLabels.aidantConnectAuthorisation"
    />
  </section>
</template>

<script setup lang="ts">
  import { userFieldLabels } from '~/client/labels'
  /** Role management by a Structure Manager cannot target the Administrator role */
  import { nonAdminUserRoleKeys } from '~/client/options'
  import { useAuthState } from '~/composables/useAuthState'
  import type { UpdateUserInput } from '~/server/schema'

  const authState = useAuthState()
  const authUserId = authState.getUserId

  const { userId = undefined, update = false } = defineProps<{
    userId?: string
    update?: boolean
  }>()

  const { value: status } = useField<UpdateUserInput['status']>('status')
  if (!update) {
    status.value = true
  }
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .title-btn-container {
    h4 {
      margin-bottom: 0;
    }

    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;

    @include dsfr-media-query.respond-from('md') {
      flex-direction: row;
      align-items: baseline;
      justify-content: space-between;

      &.border {
        box-shadow: inset 0 -1px 0 0 var(--border-default-grey);
      }
    }
  }

  .access-switch {
    @include dsfr-media-query.respond-from('md') {
      align-items: center;
    }
  }
</style>
