<template>
  <div>
    <h3>Table Sortable Header</h3>
    <h4>Ascendant</h4>
    <div id="table-sortable-header-ascendant">
      <TableSortableHeader v-bind="ascSort" />
    </div>
    <h4>Descendant</h4>
    <div id="table-sortable-header-descendant">
      <TableSortableHeader v-bind="descSort" />
    </div>
    <h4>Numeric</h4>
    <div id="table-sortable-header-numeric">
      <TableSortableHeader
        v-bind="descSort"
        numeric
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import TableSortableHeader from './TableSortableHeader.vue'
  import { SortOrder } from '~/types/table'

  const ascSort = {
    sort: SortOrder.Asc,
    label: 'Label Header'
  }

  const descSort = {
    sort: SortOrder.Desc,
    label: 'Label Header'
  }
</script>
