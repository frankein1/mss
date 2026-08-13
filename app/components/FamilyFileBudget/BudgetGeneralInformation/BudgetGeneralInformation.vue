<template>
  <section class="feature-section bg-color-white">
    <div class="bgi__header">
      <h3 class="fr-h4 fr-m-0">Infos générales</h3>
      <NuxtLink
        :to="routes.budget.AppFileBudgetInfoEdit.path(budget.familyFileId)"
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-edit-line"
      >
        Modifier
      </NuxtLink>
    </div>

    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6 fr-col-xl-3 bgi__content__item">
          <img
            src="~/assets/icons/pig.svg"
            class="item-icon"
            alt=""
          />
          <div>
            <div class="fr-text--lg fr-m-0">Epargne</div>
            <div
              class="fr-h6 fr-m-0 item__amount"
              :class="{ 'euro-symbol': !!budget.savings }"
            >
              {{ budget.savings !== null ? euros(budget.savings) : '-' }}
            </div>
          </div>
        </div>

        <div class="fr-col-12 fr-col-md-6 fr-col-xl-3 bgi__content__item">
          <hr class="bgi__content__separator bgi__content__separator--md" />
          <span
            class="fr-icon-bank-line item-icon"
            aria-hidden="true"
          ></span>
          <div>
            <div class="fr-text--lg fr-m-0">Découvert</div>
            <div
              class="fr-h6 fr-m-0 item__amount"
              :class="{ 'euro-symbol': !!budget.overdraft }"
            >
              {{ euros(budget.overdraft) || '-' }}
            </div>
          </div>
        </div>

        <div class="fr-col-12 fr-col-md-6 fr-col-xl-3 bgi__content__item">
          <hr class="bgi__content__separator bgi__content__separator--xl" />
          <img
            src="~/assets/icons/banquefrance.svg"
            class="item-icon"
            alt=""
          />
          <div>
            <div class="fr-text--lg fr-m-0">Banque de France</div>
            <div
              class="fr-h6 fr-m-0 fr-m-0 item__amount"
              :class="{ 'euro-symbol': !!budget.banqueDeFrance }"
            >
              {{
                budget.banqueDeFrance !== null
                  ? euros(budget.banqueDeFrance)
                  : '-'
              }}
            </div>
          </div>
        </div>

        <div class="fr-col-12 fr-col-md-6 fr-col-xl-3 bgi__content__item">
          <hr class="bgi__content__separator bgi__content__separator--md" />
          <span
            class="fr-icon-home-4-line item-icon"
            aria-hidden="true"
          ></span>
          <div>
            <div class="fr-text--lg fr-m-0">Quotient familial</div>
            <div class="fr-h6 fr-m-0 item__amount">
              {{ budget.familyQuotient || '-' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr class="separator" />

    <div class="bgi__content">
      <div class="bgi__content__item">
        <div class="item-icon item-icon--tertiary">
          <span
            class="fr-icon-scales-3-line fr-icon--lg"
            aria-hidden="true"
          ></span>
        </div>
        <div class="fr-text--lg fr-m-0 bold">Reste à vivre du foyer</div>
      </div>

      <div
        class="fr-h6 fr-m-0 item__amount"
        :class="{ 'euro-symbol': !!budget.remainingAfterExpenses }"
      >
        {{
          budget.remainingAfterExpenses !== null
            ? euros(budget.remainingAfterExpenses)
            : '-'
        }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import type { Budget } from '../types'
  import { routes } from '~/utils/routes'
  import { euros } from '~/utils/euros'

  defineProps<{ budget: Budget }>()
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .bgi__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;

    > h3 {
      color: var(--primary);
    }
  }

  .bgi__content {
    display: flex;
    justify-content: space-between;
  }

  .bgi__content__item {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .item__amount {
    color: var(--rust);
  }

  .bgi__content .item__amount {
    align-self: center;
  }

  .bgi__content__separator {
    width: 0.0625rem;
    height: 3.125rem;
    background-color: var(--border-default-grey);
    display: none;

    &--md {
      @include dsfr-media-query.respond-from('md') {
        display: block;
      }
    }

    &--xl {
      @include dsfr-media-query.respond-from('xl') {
        display: block;
      }
    }
  }

  .item-icon {
    padding: 0.5rem;
    border-radius: 50%;
    background: var(--rust-light);
    color: var(--rust);
    width: 2.5rem;
    height: 2.5rem;

    &--tertiary {
      padding: 0.3rem;
      border-radius: unset;
      background: none;
    }
  }

  .separator {
    height: 0.0625rem;
    background-color: var(--rust);
    background-image: none;
    padding: 0;
    margin: 1.5rem 0 1rem;
  }

  .bold {
    font-weight: var(--font-weight-bold);
  }
</style>
