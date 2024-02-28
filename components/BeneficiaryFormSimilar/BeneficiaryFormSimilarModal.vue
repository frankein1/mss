<template>
  <div>
    <p class="fr-mb-0">
      Êtes-vous sûr·e de vouloir créer ce nouveau bénéficiaire ?
    </p>
    <p>{{ similarBeneficiariesLabel }}</p>
    <div
      class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg"
    >
      <button
        class="fr-btn"
        @click="modal.close()"
      >
        Revenir au formulaire
      </button>
      <button
        class="fr-btn fr-btn--secondary"
        @click="create"
      >
        Confirmer la création
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SimilarBeneficiaries } from '~/server/trpc/routers'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { formatDate } from '~/utils/formatDate'

  const modal = useModal()

  const props = defineProps<{
    similarBeneficiaries: SimilarBeneficiaries
  }>()

  const emit = defineEmits<{ create: [] }>()

  const similarBeneficiariesLabel = computed(() => {
    const base =
      props.similarBeneficiaries.length === 1
        ? 'Dossier déjà existant :'
        : 'Dossiers déjà existants :'

    const list = props.similarBeneficiaries
      .map(s => {
        const displayName = formatBeneficiaryDisplayName(s)
        if (!s.birthDate) {
          return displayName
        }
        return `${displayName} - ${formatDate(s.birthDate)}`
      })
      .join(', ')

    return `${base} ${list}`
  })

  function create() {
    emit('create')
    modal.close()
  }
</script>
