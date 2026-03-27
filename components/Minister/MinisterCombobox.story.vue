<template>
  <div>
    <h3>Minister Combobox</h3>

    <div v-if="(list?.length || 0) > 0">
      <h4>Sans ministre initial</h4>
      <MinisterCombobox @on-set-minister-id="id => (m0 = id)" />
      <div>{{ m0 }}</div>

      <h4>Avec ministre initial actuel gouvernement</h4>
      <MinisterCombobox
        initial-minister-id="04cf1d04-8070-4daa-9348-546e0cc3339c"
        @on-set-minister-id="id => (m1 = id)"
      />
      <div>{{ m1 }}</div>

      <h4>Avec ministre initial ancien gouvernement</h4>
      <MinisterCombobox
        initial-minister-id="cd27f943-77e2-4f98-9f0e-d96658aa0e1b"
        @on-set-minister-id="id => (m2 = id)"
      />
      <div>{{ m2 }}</div>
    </div>
    <div v-else>Composant Ministre impossible à afficher</div>
  </div>
</template>

<script setup lang="ts">
  import MinisterCombobox from './MinisterCombobox.vue'

  const list = ref<any[] | undefined>(undefined)

  useTrpcClient()
    .minister.getMinisters.useQuery()
    .then(m => {
      list.value = m.data.value
    })

  const m0 = ref<string | null>(null)
  const m1 = ref<string | null>(null)
  const m2 = ref<string | null>(null)
</script>
