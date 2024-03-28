<template>
  <form
    ref="form"
    novalidate
  >
    <main class="fr-container content">
      <DsfrBreadcrumb
        :links="Breadcrumb.AppBeneficiaryBudgetInfo(beneficiaryIdentification)"
      />
      <PageTitle
        :title="title"
        pictogram="/pictograms/money.svg"
      />
    </main>

    <div class="actions-bar">
      <ul class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right">
        <li>
          <button
            class="fr-btn fr-btn--secondary"
            type="button"
            @click="() => {}"
          >
            Annuler
          </button>
        </li>
        <li>
          <button
            class="fr-btn submit-btn"
            type="submit"
            :submitting="isSubmitting"
            :disabled="isSubmitting"
          >
            Valider
          </button>
        </li>
      </ul>
    </div>
  </form>
</template>

<script lang="ts" setup>
  import { Breadcrumb, RouteTitle } from '~/utils/routing'
  import { BeneficiaryIdentification } from '~/types/beneficiary'

  // FIXME move to trpc query
  defineProps<{
    beneficiaryIdentification: BeneficiaryIdentification | null
  }>()

  const title = RouteTitle.AppBeneficiaryBudgetInfo()

  useHead({ title })

  const form = ref<HTMLFormElement | null>(null)
  const isSubmitting = ref(false)
</script>
