import DpoRedirectModal from '~/components/DpoRedirectModal/DpoRedirectModal.vue'

/** Perform DPO check if has not been done yet during the session
 * If during navigation, the modal can be used directly
 * If during app first load, we have to wait for the modal to be ready */
export function useDPOCheckOnStartup() {
  // Guarantees that the check is performed only once on app startup
  const once = useState<boolean>('dpo:once', () => false)

  const status = ref<{
    shouldFillDPO: boolean
    compulsory: boolean
  } | null>(null)

  const modal = useModal()

  async function init() {
    const trpcClient = useTrpcClient()
    status.value = await trpcClient.structure.getStructureDPOStatus.query()
  }

  function showModal() {
    if (status.value?.shouldFillDPO) {
      modal.open(DpoRedirectModal, {
        triggerOpen: true,
        title: 'Compléter les informations de votre structure',
        content:
          'Conformément aux conditions générales d’utilisation, vous devez renseigner les coordonnées du délégué ou de la personne référente à la protection de données.'
      })
    }
    once.value = true
  }

  function watchModal() {
    // The watcher for the modal has to be managed on client side
    if (import.meta.client) {
      const unwatch = watch(modal.isReady, () => {
        if (modal.isReady.value) {
          showModal()
          unwatch()
        }
      })
    }
  }

  if (!once.value) {
    init()
      .then(() => (modal.isReady.value ? showModal() : watchModal()))
      .catch(() => console.log('dpo check has failed'))
  }
}
