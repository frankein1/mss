<template>
  <div
    v-if="ministers?.length"
    class="table-container fr-mt-3w"
    tabindex="0"
  >
    <div
      class="fr-table fr-table--bordered fr-table--no-caption fr-mb-0 fr-pt-0"
    >
      <table>
        <caption>
          Liste des Ministres
        </caption>
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Prénom</th>
            <th scope="col">Fonction</th>
            <th scope="col">Ministère</th>
            <th scope="col">Gouvernement</th>
            <th scope="col">Gouvernement passé</th>
          </tr>
        </thead>
        <tbody>
          <NuxtLink
            v-for="minister in ministers"
            :key="minister.id"
            v-slot="{ navigate }"
            custom
            :to="routes.admin.AdminMinisterUpdate.path(minister.id)"
          >
            <tr
              class="clickable-row"
              @click="navigate"
            >
              <td>{{ minister.firstName }}</td>
              <td>{{ minister.lastName }}</td>
              <td>{{ minister.function }}</td>
              <td>{{ minister.ministry ? minister.ministry : '–' }}</td>
              <td>{{ minister.government }}</td>
              <td>{{ minister.former ? 'Oui' : 'Non' }}</td>
            </tr>
          </NuxtLink>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import type { AdminMinistersOutput } from './types'

  defineProps<{ ministers: AdminMinistersOutput[] }>()
</script>

<style scoped lang="scss">
  .table-container {
    width: 100%;
    max-width: 100%;

    .fr-table {
      width: 100%;
      max-width: 100%;
      overflow-x: auto;
    }

    .clickable-row {
      cursor: pointer;
    }
  }
</style>
