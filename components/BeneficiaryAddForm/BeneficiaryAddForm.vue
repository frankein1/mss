<template>
  <!-- add form errors-->
  <form
    v-if="!success"
    ref="form"
    novalidate
    class="fr-p-3v"
    @submit.prevent="onSubmit"
  >
    <p><RequiredFields /></p>
    <p>
      Les champs suivants sont nécessaires pour ajouter un membre au dossier et
      créer sa fiche. Vous pourrez remplir des informations supplémentaires si
      vous le souhaitez par la suite.
    </p>

    <ul class="fr-btns-group fr-btns-group--inline-md btns-groups">
      <li>
        <button
          class="fr-btn fr-btn--secondary fr-mb-0"
          @click.prevent="onClose"
        >
          Annuler
        </button>
      </li>
      <li>
        <button
          class="fr-btn fr-btn fr-mb-0"
          type="submit"
        >
          Confirmer la création
        </button>
      </li>
    </ul>
  </form>

  <BeneficiaryAddSuccess
    v-else
    @go-to-beneficiary="goToBeneficiary"
    @go-to-beneficiary-form="goToBeneficiaryForm"
  />
</template>

<script setup lang="ts">
  const modal = useModal()
  const success = useState('success', () => false)

  const onSubmit = () => {
    // ...
    // if request success
    success.value = true
    modal.setTitle()
  }

  const onClose = () => {
    modal.close()
    success.value = false
  }

  const goToBeneficiary = () => {
    console.log('redirection vers page du nouveau bénéficiaire')
  }
  const goToBeneficiaryForm = () => {
    console.log('redirection vers formulaire du nouveau bénéficiaire')
  }

  const stopWatchingIsOpen = watch(modal.isOpen, value => {
    if (!value) {
      success.value = false
    }
  })
  onUnmounted(() => {
    stopWatchingIsOpen()
  })
</script>

<style scoped lang="scss">
  .btns-groups {
    justify-content: flex-end;
  }
</style>
