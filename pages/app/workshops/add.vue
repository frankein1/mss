<template>
  <div>
    <div class="fr-container">
      <AtomBreadcrumb :links="breadcrumbs.workshop.AppWorkshopAdd()" />
      <div class="page-title-container fr-mb-4w">
        <div class="page-title-image">
          <img
            src="/pictograms/calendar.svg"
            alt=""
          />
        </div>
        <PageTitle
          :title="title"
          no-margin
        />
      </div>
      <RequiredFields />

      <AtomAlert
        v-if="error"
        class="fr-mb-2w"
        :alert-type="AlertType.Error"
        message="La liste des référents n'a pas pu être chargée."
      />
      <AtomLoader
        v-else-if="pending"
        class="fr-mx-auto"
      />
    </div>
    <WorkshopCreationForm
      :is-submitting="false"
      @save-workshop="onCreateWorkshop"
      @cancel="onCancel"
    />
  </div>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const title = routes.workshop.AppWorkshopAdd.title

  useHead({ title })

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()
  const matomo = useMatomo()
  const isSubmitting = ref(false)
  const pending = ref(false)
  const error = ref(false)

  const onCancel = () => {
    useRouter().back()
  }

  const onCreateWorkshop = (input: any) => {
    console.log(input)
  }
</script>

<style scoped lang="scss">
  .fr-container {
    max-width: 58rem;
  }

  .page-title-container {
    display: flex;
    align-items: center;

    .page-title-image {
      border-radius: 0.5rem;
      background-color: #fff;
      margin-right: 1rem;
      width: 6rem;
      height: 6rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
