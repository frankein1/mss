<template>
  <section class="feature-section">
    <h2 class="fr-h4 text--primary">Informations de profil</h2>
    <AtomAlert
      v-if="alertVisible"
      class="fr-mb-8v"
      :alert-type="AlertType.Warning"
      message="La modification d’un nom ou d’un prénom écrase le précédent."
      closeable
      @close="alertVisible = false"
    >
      <template #detailedMessage>
        <p>
          Le nouveau nom/prénom est alors mis à jour sur l’ensemble des
          activités générées par ce compte utilisateur&nbsp;: ses anciens suivis
          ont le nouveau nom, il est modifié également comme agent référent sur
          les dossiers sélectionnés, etc…
        </p>
      </template>
    </AtomAlert>

    <VeeInput
      name="firstName"
      :label="userFieldLabels.firstName"
      required
    />
    <VeeInput
      name="lastName"
      :label="userFieldLabels.lastName"
      required
    />
    <!--  email update is disabled -->
    <VeeInput
      name="email"
      :label="userFieldLabels.email"
      type="email"
      required
      :disabled="update"
    />
  </section>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { userFieldLabels } from '~~/client/labels'

  const { update = false } = defineProps<{
    update?: boolean
  }>()

  const alertVisible = ref(update)
</script>
