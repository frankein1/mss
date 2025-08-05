<template>
  <AtomAlert
    v-if="error"
    :alert-type="AlertType.Error"
    message="Les informations de l'atelier n'ont pas pu être chargées."
  />
  <AtomLoader
    v-else-if="pending"
    class="fr-mx-auto"
  />
  <div v-else-if="workshop">
    <div class="fr-container--fluid container-top">
      <PageContainer class="fr-pb-1w fr-pt-1w">
        <AtomBreadcrumb :links="breadcrumbs.workshop.AppWorkshop(workshop)" />
        <NuxtLink
          :to="backLink"
          class="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-left-line fr-btn--icon-left"
        >
          Retour
        </NuxtLink>
        <WorkshopHeader :workshop="workshop" />
      </PageContainer>
    </div>
    <div class="fr-container--fluid container-middle">
      <PageContainer>
        <WorkshopCreateAttendee
          class="add-participant"
          :attendees="workshop.workshopAttendees"
          @refresh="refresh"
        />
      </PageContainer>
    </div>
    <div class="fr-container--fluid">
      <PageContainer class="fr-pb-1w fr-pt-1w">
        <WorkshopAttendeeList
          :workshop="workshop"
          @delete-attendee="onDeleteAttendee"
          @change-attendance="onChangeAttendance"
        />
      </PageContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { routes } from '~/utils/routes'
  import { AlertType } from '~/utils/constants/alert'
  import { WorkshopWithAttendeesDetails } from '~/types/workshop'
  import { WorkshopTab } from '~/utils/constants/workshop'
  import { WorkshopAttendeeAttendance } from '@prisma/client'
  import { isWorkshopPassed } from '~/utils/workshops/isWorkshopPassed'

  const trpcClient = useTrpcClient()
  const route = useRoute()
  const snackbar = useSnackbar()
  const workshopId = route.params.id as string

  const router = trpcClient.workshop
  const { mutate, error: deleteAttendeeError } =
    router.deleteAttendee.useMutation()
  const { mutate: mutateAttendance, error: attendanceError } =
    router.updateAttendeeAttendance.useMutation()

  const { data, pending, error, refresh } =
    await trpcClient.workshop.getOne.useQuery({
      id: workshopId,
      includeAttendees: true
    })

  const workshop = computed(() => data.value as WorkshopWithAttendeesDetails)

  const backLink = computed(() => {
    const isPassed = isWorkshopPassed(
      workshop.value.date,
      workshop.value?.startTime,
      workshop.value?.endTime
    )
    const link = routes.workshop.AppWorkshops.path({
      tab: isPassed
        ? WorkshopTab.PassedWorkshops
        : WorkshopTab.UpcomingWorkshops
    })
    return link
  })

  useHead({
    title: routes.workshop.AppWorkshop.title(workshop.value || null)
  })

  // Delete an attendee
  const onDeleteAttendee = async (attendeeId: string) => {
    const deletedAttendee = await mutate({ id: attendeeId })
    if (deleteAttendeeError.value || deletedAttendee === null) {
      snackbar.error('La suppression du participant a échoué.')
      return
    }
    refresh()
    snackbar.success('La suppression du participant a réussi.')
  }
  const onChangeAttendance = async (
    attendeeId: string,
    attendance: WorkshopAttendeeAttendance
  ) => {
    const result = await mutateAttendance({
      id: attendeeId,
      attendance: attendance
    })
    if (attendanceError.value || result === null) {
      snackbar.error('La modification du participant a échoué.')
      return
    }
    snackbar.success('La modification du participant a réussi.')
  }
</script>

<style lang="scss" scoped>
  .container-top {
    background-color: var(--color-workshop-light);
  }

  .container-middle {
    background: var(--color-workshop-light);
    background: linear-gradient(
      180deg,
      var(--color-workshop-light) 0%,
      var(--color-workshop-light) 50%,
      var(--background-alt-grey) 50%,
      var(--background-alt-grey) 100%
    );

    .fr-container {
      padding-bottom: 0 !important;
    }
  }

  .add-participant {
    margin: 0 auto;
  }
</style>
