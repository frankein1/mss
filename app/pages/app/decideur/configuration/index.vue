<script lang="ts" setup>
  import { routes } from '~/utils/routes'

  definePageMeta({
    middleware: [
      function () {
        return navigateTo(
          routes.decisionMaker.AppDecisionMakerConfigurationAccount.path(),
          { replace: true }
        )
      }
    ]
  })
</script>
