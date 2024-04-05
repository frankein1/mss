<template>
  <div>
    <p>Le commentaire sera retiré de l'accompagnement.</p>
    <div class="delete-btn-container">
      <button
        class="fr-btn"
        @click="deleteComment"
      >
        Supprimer
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const modal = useModal()

  const props = defineProps<{ delete: () => {} }>()

  function deleteComment() {
    props.delete()
    modal.close()
  }
</script>

<style scoped>
  .delete-btn-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
