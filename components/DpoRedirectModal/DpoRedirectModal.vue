<template>
  <div class="fr-container">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <p>{{ props.content }}</p>
        <p></p>
      </div>
    </div>
    <ul
      class="fr-btns-group fr-btns-group--lg fr-btns-group--inline-md fr-btns-group--right"
    >
      <li>
        <button
          class="fr-btn fr-btn--secondary fr-mb-0"
          type="button"
          @click="cancel"
        >
          Pas maintenant
        </button>
      </li>
      <li>
        <button
          class="fr-btn fr-mb-0"
          type="button"
          @click="redirectToStructure"
        >
          Continuer
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { RoutePath } from '~/utils/routing'
  const modal = useModal()

  const props = defineProps<{ content: string }>()

  const redirectToStructure = () => {
    navigateTo({
      path: RoutePath.AppStructure(),
      query: {
        modifyStructure: 'true'
      }
    })
  }

  const cancel = () => {
    modal.close()
  }
</script>
