<template>
  <section
    class="card-outline"
    :class="`card-outline--${color}`"
  >
    <div class="budget-card__title">
      <h4 class="fr-text--lead fr-m-0">{{ title }}</h4>

      <span class="fr-h6 fr-m-0 euro-symbol">
        {{ euros(total) }}
      </span>
    </div>

    <!-- No subsection -->
    <template v-if="!hasSubsections && items">
      <ul class="list-styled">
        <li
          v-for="item in items"
          :key="item.key"
        >
          <span>{{ item.label }}</span>
          <span class="budget-card__item__value euro-symbol">
            {{ euros(item.amount) }}
          </span>
        </li>
      </ul>
    </template>

    <!-- Subsection -->
    <template v-else-if="hasSubsections && subsectionItems">
      <ul class="list-styled">
        <li
          v-for="(item, index) in subsectionItems"
          :key="index"
        >
          <div class="fr-container">
            <div class="fr-grid-row">
              <div class="fr-col-12 budget-card__subcategory fr-mb-1v">
                <span>{{ item.type }}</span>
                <span class="budget-card__item__value euro-symbol">
                  {{
                    item.amountPerMonth != null
                      ? euros(item.amountPerMonth)
                      : '-'
                  }}
                </span>
              </div>

              <div
                v-if="item.amountTotal != null"
                class="fr-col-12 budget-card__subcategory fr-text--xs fr-mb-1v grey"
              >
                <span>Montant total</span>
                <span class="euro-symbol">
                  {{ euros(item.amountTotal) }}
                </span>
              </div>

              <div
                v-if="item.dueDate"
                class="fr-col-12 budget-card__subcategory fr-text--xs fr-mb-1v grey"
              >
                <span>Échéance</span>
                <span>
                  {{ formatDate(item.dueDate) }}
                </span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </template>

    <div
      class="budget-card__action"
      :class="`budget-card__action--${color}`"
    >
      <NuxtLink
        :to="editRoute"
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-edit-line"
        title="Modifier"
      >
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
  import type { Prisma } from '~/prisma/generated/client'

  withDefaults(
    defineProps<{
      color: 'rust' | 'deep-blue'
      title: string
      total: number
      editRoute: string
      items?: {
        key: string
        label: string
        amount: number
      }[]
      // with subsections
      hasSubsections?: boolean
      subsectionItems?: {
        type: string | null
        amountTotal: Prisma.Decimal | null
        amountPerMonth: Prisma.Decimal | null
        dueDate: Date | null
      }[]
    }>(),
    {
      items: undefined,
      hasSubsections: false,
      subsectionItems: () => [],
      labelGetter: undefined,
      valueGetter: undefined
    }
  )
</script>

<style scoped lang="scss">
  @use '~/assets/style/card' as *;
  @use '~/assets/style/list' as *;

  .fr-container {
    padding: 0;
  }

  .budget-card__title {
    display: flex;
    justify-content: space-between;
  }

  .budget-card__item__value {
    font-weight: var(--font-weight-bold);
  }

  .budget-card__action {
    display: flex;
    justify-content: flex-end;

    &--rust {
      > .fr-btn {
        color: var(--rust);
      }
    }

    &--deep-blue {
      > .fr-btn {
        color: var(--deep-blue);
      }
    }
  }

  .budget-card__subcategory {
    display: flex;
    justify-content: space-between;
  }

  .grey {
    color: var(--text-mention-grey);
  }
</style>
