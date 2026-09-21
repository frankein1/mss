<template>
  <div v-if="formerStructures.length > 0">
    <h3 class="fr-h6">Anciennes structures</h3>
    <div class="feature-section">
      <div class="fr-table fr-table--bordered">
        <table>
          <thead>
            <tr>
              <th scope="col">Structure</th>
              <th scope="col">Rôle occupé</th>
              <th scope="col">Date de départ</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, index) in formerStructures"
              :key="index"
            >
              <td>
                <span
                  v-if="entry.disabled"
                  class="fr-text--sm text--italic text--muted"
                >
                  {{ entry.structureName }}
                </span>
                <span v-else>
                  {{ entry.structureName }}
                </span>
              </td>
              <td>{{ entry.roleLabel }}</td>
              <td>{{ formatDate(entry.leftAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    formerStructures: {
      structureName: string
      roleLabel: string
      leftAt: Date | string
      disabled: boolean
    }[]
  }>()

  function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
</script>

<style scoped>
  .text--italic {
    font-style: italic;
  }

  .text--muted {
    color: var(--text-mention-grey);
  }
</style>
