<script lang="ts" setup>
  import { routes } from '~/utils/routes'

  definePageMeta({
    middleware: [
      function () {
        const { application } = usePermissions()

        return navigateTo(
          application.value.module.users
            ? routes.structure.AppStructureUsers.path()
            : routes.structure.AppStructureInfo.path(),
          { replace: true }
        )
      }
    ]
  })
</script>
