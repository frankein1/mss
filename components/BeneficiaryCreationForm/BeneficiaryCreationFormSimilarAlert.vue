<template>
  <div class="fr-col-12">
    <AtomAlert
      :alert-type="AlertType.Warning"
      message="Un dossier semble déjà exister pour ce bénéficiaire"
    >
      <template #detailedMessage>
        <ul class="fr-raw-list">
          <li
            v-for="similar in similarBeneficiaries"
            :key="similar.id"
          >
            <!-- TODO: Not referent case -->
            <NuxtLink :to="RoutePath.AppBeneficiary(similar.id)">
              {{ formatBeneficiaryDisplayName(similar)
              }}<template v-if="similar.birthDate">
                - {{ formatDate(similar.birthDate) }}</template
              ></NuxtLink
            >
          </li>
        </ul>
        <p>
          Avant de créer un nouveau bénéficiaire, pensez à utiliser la recherche
          pour vérifier qu'il n'est pas déjà créé.
        </p>
      </template>
    </AtomAlert>
  </div>
  <OpenModalHack />
</template>

<script setup lang="ts">
  import { SimilarBeneficiaries } from '~/server/trpc/routers'
  import { AlertType } from '~/utils/constants/alert'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { formatDate } from '~/utils/formatDate'
  import { RoutePath } from '~/utils/routing'

  defineProps<{
    similarBeneficiaries: SimilarBeneficiaries
  }>()
</script>
