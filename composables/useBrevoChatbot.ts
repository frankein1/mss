declare global {
  interface Window {
    BrevoConversationsID: string
    BrevoConversationsSetup: { colors: { buttonBg: string } }
    BrevoConversations: any
  }
}

export function useBrevoChatbot() {
  // Load widget on mount
  onMounted(() => {
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://conversations-widget.brevo.com/brevo-conversations.js'
    window.BrevoConversationsID = '66742599a806840bce5153d6'
    window.BrevoConversationsSetup = { colors: { buttonBg: '#4550e5' } }

    script.onload = () => {
      window.BrevoConversations =
        window.BrevoConversations ||
        function (args: any) {
          ;(window.BrevoConversations.q =
            window.BrevoConversations.q || []).push(...args)
        }
    }

    if (document.head) {
      document.head.appendChild(script)
    }
  })

  // Destroy widget on unmount
  onBeforeUnmount(() => {
    window?.BrevoConversations('kill', true)
  })

  const openChat = () => {
    window?.BrevoConversations('openChat', true)
  }

  return { openChat }
}
