<template>
  <section class="feature-section bg-color-white">
    <div class="bgi__header">
      <h3 class="fr-h4 fr-m-0">Infos générales</h3>
      <NuxtLink
        :to="RoutePath.AppBeneficiaryBudgetInfoEdit(budget.beneficiaryId)"
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-edit-line"
      >
        Modifier
      </NuxtLink>
    </div>

    <section class="bgi__content">
      <div class="bgi__content__item">
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
            {{ euros(budget.savings) || '-' }}
          </div>
        </div>
      </div>

      <hr class="bgi__content__separator" />

      <div class="bgi__content__item">
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

      <hr class="bgi__content__separator" />

      <div class="bgi__content__item">
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
            {{ euros(budget.banqueDeFrance) || '-' }}
          </div>
        </div>
      </div>

      <hr class="bgi__content__separator" />

      <div class="bgi__content__item">
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
    </section>

    <hr class="separator" />

    <section class="bgi__content">
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
        :class="{ 'euro-symbol': true }"
      >
        {{ euros(213) || '-' }}
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
  import { Budget } from '@prisma/client'
  import { RoutePath } from '~/utils/routing'
  import { euros } from '~/utils/euros'

  defineProps<{ budget: Budget }>()
</script>

<style scoped lang="scss">
  .bgi__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.25rem;

    > h3 {
      color: var(--primary);
    }
  }

  .bgi__content {
    display: flex;
    place-content: center space-between;
  }

  .bgi__content__item {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .item__amount {
    color: var(--rust);
  }

  .bgi__content__separator {
    width: 0.0625rem;
    height: 3.125rem;
    background-color: var(--border-default-grey);
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
    margin: 1.5rem 0 1rem 0;
  }

  .bold {
    font-weight: var(--bold);
  }
</style>
