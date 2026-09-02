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
            <th scope="col">Création</th>
            <th scope="col">Connexion</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="structure in structures"
            :key="structure.id"
            class="clickable-row"
          >
            <td>
              <NuxtLink
                :to="routes.admin.AdminStructure.path(structure.id)"
                class="table-row-link"
              >
                {{ structure.name }}
              </NuxtLink>
            </td>
            <td>{{ structureTypeKeys.value(structure.type) }}</td>
            <td>{{ structure.zipcode }}</td>
            <td>{{ structure.city }}</td>
            <td>{{ formatDate(structure.created) }}</td>
            <td>
              <span
                :class="structure.isInactive ? 'fr-badge fr-badge--error' : ''"
              >
                {{ formatDate(structure.lastAccess) || 'Aucune' }}
              </span>
              <span v-if="structure.isInactive">
                ({{ structure.deactivationAlertEmail }})
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Structures } from './types'
  import { structureTypeKeys } from '~~/client/options'
  import { routes } from '~/utils/routes'

  defineProps<{ structures: Structures }>()
</script>
