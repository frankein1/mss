<script setup lang="ts">
  definePageMeta({
    middleware: [
      function (to) {
        if (to.path === '/app/history') {
          return navigateTo('/app/history/followups', { replace: true })
        }
      }
    ]
  })
</script>
