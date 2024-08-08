import { ContactsApi } from '@getbrevo/brevo'

function getContactsApi() {
  const config = useRuntimeConfig()
  const contactsApi = new ContactsApi()
  contactsApi.setApiKey(0, config.brevo.apiKey)
  return contactsApi
}

const brevoClient = {
  getContactsApi
}

export { brevoClient }
