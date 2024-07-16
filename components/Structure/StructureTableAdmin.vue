<template>
  <div
    v-if="structures?.length"
    class="table-container fr-mt-3w"
    tabindex="0"
  >
    <div
      class="fr-table fr-table--bordered fr-table--no-caption fr-mb-0 fr-pt-0"
    >
      <table>
        <caption>
          Liste des structures
        </caption>
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Type</th>
            <th scope="col">Code postal</th>
            <th scope="col">Ville</th>
            <th scope="col">Connexion</th>
          </tr>
        </thead>
        <tbody>
          <NuxtLink
            v-for="structure in structures"
            :key="structure.id"
            v-slot="{ navigate }"
            custom
            :to="routes.admin.AdminStructure.path(structure.id)"
          >
            <tr
              class="clickable-row"
              @click="navigate"
            >
              <td>{{ structure.name }}</td>
              <td>{{ structureTypeKeys.value(structure.type) }}</td>
              <td>{{ structure.zipcode }}</td>
              <td>{{ structure.city }}</td>
              <td>
                <span :class="structure.canBeDisabled ? 'fr-badge--error' : ''">
                  {{ formatDate(structure.lastAccess) || 'Aucune' }}
                </span>
                <span v-if="structure.canBeDisabled">
                  ({{ structure.deactivationAlertEmail }})
                </span>
              </td>
            </tr>
          </NuxtLink>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Structures } from './types'
  import { structureTypeKeys } from '~/client/options'
  import { routes } from '~/routes'

  defineProps<{
    structures: Structures
    pending: boolean
  }>()
</script>
