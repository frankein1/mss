<script setup lang="ts">
  definePageMeta({
    middleware: [
      function () {
        return navigateTo('/app/stats/beneficiaries', { replace: true })
      }
    ]
  })
</script>
