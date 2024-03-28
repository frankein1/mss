<template>
  <div class="feature-section bg-color-white">
    <div class="bgi__header">
      <h3 class="fr-h4 fr-m-0">Infos générales</h3>
      <NuxtLink
        :to="RoutePath.AppBeneficiaryBudgetInfo(beneficiaryId, budgetId)"
        class="fr-btn fr-btn--tertiary-no-outline fr-icon-edit-line"
      >
        Modifier
      </NuxtLink>
    </div>

    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les informations générales du budget n'ont pas pu être chargées."
    />

    <div
      v-else
      class="bgi__content"
    >
      <div class="bgi__content__item">
        <div class="item-icon">
          <span
            class="fr-icon-scales-3"
            aria-hidden="true"
          ></span>
        </div>
        <div>
          <div class="fr-text--lg fr-m-0">Reste à vivre</div>
          <div class="fr-h6 fr-m-0 fr-m-0 item__amount">
            {{ data?.remainingAfterExpenses || '-' }}
          </div>
        </div>
      </div>

      <hr class="bgi__content__separator" />

      <div class="bgi__content__item">
        <img
          src="~/assets/icons/pig.svg"
          class="item-icon"
          alt=""
        />
        <div>
          <div class="fr-text--lg fr-m-0">Epargne</div>
          <div class="fr-h6 fr-m-0 item__amount">
            {{ data?.savings || '-' }}
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
          <div class="fr-h6 fr-m-0 item__amount">
            {{ data?.overdraft || '-' }}
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
            {{ data?.familyQuotient || '-' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { RoutePath } from '~/utils/routing'
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    beneficiaryId: string
    budgetId: string
  }>()

  const trpcClient = useTrpcClient()

  const { data, pending, error } = await trpcClient.budget.getInfo.useQuery({
    id: props.budgetId
  })
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
    justify-content: space-between;
  }

  .bgi__content__item {
    display: flex;
    align-items: center;
    gap: 1.25rem;

    .item__amount {
      color: var(--rust);
    }
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
  }
</style>
