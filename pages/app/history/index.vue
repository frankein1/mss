<script setup lang="ts">
  definePageMeta({
    middleware: [
      function () {
        return navigateTo('/app/history/followups', { replace: true })
      }
    ]
  })
</script>
