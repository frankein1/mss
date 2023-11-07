<template>
  <!--
    FIXME: For now, programmatically opening a DSFR modal needs to have a button binded to it.
    See https://gouvfr.slack.com/archives/C012RFZPTRN/p1690461322541209 and https://github.com/GouvernementFR/dsfr/issues/395
    It could be turned into a composable only once fixed.
  -->
  <button
    ref="cancelBtn"
    data-fr-opened="false"
    aria-controls="global-modal"
    type="button"
    hidden
  ></button>
</template>

<script setup lang="ts">
  useLeaveBeneficiaryFormConfirmation()
</script>
