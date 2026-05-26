<script setup lang="ts">
  definePageMeta({
    middleware: [
      function (to) {
        if (to.path === '/app/stats') {
          return navigateTo('/app/stats/beneficiaries', { replace: true })
        }
      }
    ]
  })
</script>
