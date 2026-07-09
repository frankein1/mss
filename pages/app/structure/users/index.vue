<script lang="ts" setup>
  import { routes } from '~/utils/routes'

  definePageMeta({
    middleware: [
      function () {
        const { application } = usePermissions()

        if (!application.value.module.users) {
          return navigateTo(routes.structure.AppStructureInfo.path(), {
            replace: true
          })
        }
      }
    ]
  })
</script>
