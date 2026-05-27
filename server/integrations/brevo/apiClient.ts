import type { Structure } from '@prisma/client'
import type { mapStructureToBrevoCompany, mapUserToBrevoContact } from './utils'
import { URLSearchParams } from 'url'

// Do not use Brevo's official TypeScript SDK under any circumstances.
// It was obviously poorly auto-generated from another language, is not maintained,
// and even the simplest example from the README doesn't work.
// Cf. https://github.com/getbrevo/brevo-node/issues/25
// Use direct HTTP calls for now.

const API_HOST = 'https://api.brevo.com/v3'
function getApiKey() {
  return useRuntimeConfig()?.brevo?.apiKey
}

export async function getContact(userId: string) {
  if (!getApiKey()) {
    return
  }
  const result = await fetch(
    `${API_HOST}/contacts/${userId}?identifierType=ext_id`,
    {
      method: 'GET',
      headers: {
        'api-key': getApiKey()
      }
    }
  )

  return result.json()
}

export async function createOrUpdateContact(
  contact: ReturnType<typeof mapUserToBrevoContact>
) {
  if (!getApiKey()) {
    return
  }
  await fetch(`${API_HOST}/contacts`, {
    method: 'POST',
    headers: {
      'api-key': getApiKey(),
      'content-type': 'application/json'
    },
    body: JSON.stringify(contact)
  })
}

export async function createCompany(structure: Pick<Structure, 'id' | 'name'>) {
  if (!getApiKey()) {
    return
  }
  const { id, name } = structure
  const result = await fetch(`${API_HOST}/companies`, {
    method: 'POST',
    headers: {
      'api-key': getApiKey(),
      'content-type': 'application/json'
    },
    body: JSON.stringify({ name, attributes: { ext_id: id } })
  })
  const company = await result.json()
  return company
}

export async function updateCompany(
  id: string,
  company: ReturnType<typeof mapStructureToBrevoCompany>
) {
  if (!getApiKey()) {
    return
  }
  await fetch(`${API_HOST}/companies/${id}`, {
    method: 'PATCH',
    headers: {
      'api-key': getApiKey(),
      'content-type': 'application/json'
    },
    body: JSON.stringify(company)
  })
}

export async function linkContactToCompany({
  companyId,
  contactId
}: {
  companyId: string
  contactId: string
}) {
  if (!getApiKey()) {
    return
  }
  await fetch(`${API_HOST}/companies/link-unlink/${companyId}`, {
    method: 'PATCH',
    headers: {
      'api-key': getApiKey(),
      'content-type': 'application/json'
    },
    body: JSON.stringify({ linkContactIds: [contactId] })
  })
}

export async function getCompanyAttributes() {
  if (!getApiKey()) {
    return
  }
  await fetch(`${API_HOST}/crm/attributes/companies`, {
    method: 'GET',
    headers: {
      'api-key': getApiKey()
    }
  })
}

export async function createCompanyAttribute({
  name,
  type,
  options
}: {
  name: string
  type: 'text' | 'boolean' | 'date' | 'number' | 'single-select'
  options?: string[]
}) {
  if (!getApiKey()) {
    return
  }
  await fetch(`${API_HOST}/crm/attributes`, {
    method: 'POST',
    headers: {
      'api-key': getApiKey(),
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      attributeType: type,
      objectType: 'companies',
      label: name,
      optionsLabels: options
    })
  })
}

export async function createContactAttribute({
  name,
  type,
  options
}: {
  name: string
  type: 'id' | 'text' | 'boolean' | 'date' | 'float' | 'category'
  options?: string[]
}) {
  if (!getApiKey()) {
    return
  }
  await fetch(
    `${API_HOST}/contacts/attributes/${type === 'category' ? 'category' : 'normal'}/${name}`,
    {
      method: 'POST',
      headers: {
        'api-key': getApiKey(),
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        type,
        enumeration: options?.map((option, index) => ({
          label: option,
          // Value must be an int (???), and it needs to be > 0
          // Using 0 as a value makes the API -  very correctly & usefully -
          // the following error message: "Missing enumeration value"
          value: index + 1
        }))
      })
    }
  )
}

export async function getCompanies() {
  if (!getApiKey()) {
    return
  }
  await fetch(`${API_HOST}/companies`, {
    method: 'GET',
    headers: {
      'api-key': getApiKey()
    }
  })
}

interface SendEventOptions {
  event_name: string
  identifiers: {
    contact_id?: string
    email_id?: string
    ext_id?: string
  }
  contact_properties?: Record<string, string | number>
  event_date?: string
  event_properties?: Record<string, string | number>
  object?: {
    identifiers?: {
      id?: string
      ext_id?: string
    }
    type?: string
  }
}

export async function sendEvent(options: SendEventOptions) {
  if (!getApiKey()) {
    return
  }
  await fetch(`${API_HOST}/events`, {
    method: 'POST',
    headers: {
      'api-key': getApiKey(),
      'content-type': 'application/json'
    },
    body: JSON.stringify(options)
  })
}

export async function getCompanyByStructureId(structure_id: string) {
  if (!getApiKey()) {
    return
  }
  const queryParams = new URLSearchParams({
    filters: JSON.stringify({ 'attributes.ext_id': structure_id })
  })
  const result = await fetch(`${API_HOST}/companies?${queryParams}`, {
    method: 'GET',
    headers: {
      'api-key': getApiKey()
    }
  })
  if (!result.ok) {
    const message = await result.text()
    throw new Error(`Call to Brevo API failed: ${message}`)
  }
  const json = await result.json()
  const company = json.items[0]
  return company
}
