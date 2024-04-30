const STRUCTURE_DOWNLOAD_URL_JSON =
  'https://www.data.gouv.fr/fr/datasets/r/4fc64287-e869-4550-8fb9-b1e0b7809ffa'

export async function downloadStructures() {
  const res = await fetch(STRUCTURE_DOWNLOAD_URL_JSON, {
    headers: { 'Content-Type': 'application/json' }
  })

  if (res.ok) {
    const data = await res.json()

    return { data, headers: res.headers, error: null }
  }

  return {
    data: null,
    headers: res.headers,
    error: { status: res.status, msg: res.statusText }
  }
}
