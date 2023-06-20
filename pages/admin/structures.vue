<template>
  <div>
    <div
      v-for="structure in structures"
      :key="structure.id"
      class="structures__row"
    >
      <div class="structures__name">
        <div class="item__value">{{ structure.name }}</div>
        <div class="item__value">{{ structure.type }}</div>
        <div class="item__value">{{ structure.siret }}</div>
      </div>
      <div class="structures__address">
        <div class="item__value">{{ structure.address }}</div>
        <div class="item__value">
          {{ `${structure.zipcode} ${structure.city}` }}
        </div>
      </div>
      <div class="structures__contact">
        <div class="item__value">{{ structure.phone }}</div>
        <div class="item__value">
          {{ structure.email }}
        </div>
      </div>
      <div class="structures__detail">
        <div class="item__value">
          {{ structure.inhabitantsNumber }}
          {{ structure.inseeCode }}
        </div>
      </div>
      <div class="structures__count">
        <div class="item__value">
          {{ `${structure._count.beneficiaries} bénéficiaires` }}
        </div>
        <div class="item__value">
          {{ `${structure._count.users || 0} utilisateurs` }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  const { structures } = await useTrpcClient().admin.getStructures.query()
</script>

<style lang="scss" scoped>
  .structures__row {
    display: flex;
    padding: 1rem;
  }

  .structures__name {
    width: 200px;
    padding-left: 0.5rem;
  }

  .structures__address {
    width: 200px;
    padding-left: 0.5rem;
  }

  .structures__contact {
    width: 200px;
    padding-left: 0.5rem;
  }
</style>
