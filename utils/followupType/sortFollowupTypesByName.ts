import { FollowupTypeIdAndName } from '~/types/followupType'

export function sortFollowupTypesByName(
  a: FollowupTypeIdAndName,
  b: FollowupTypeIdAndName
) {
  const insensitiveAName = a.name.toLowerCase()
  const insensitiveBName = b.name.toLowerCase()

  if (insensitiveAName < insensitiveBName) {
    return -1
  }
  if (insensitiveAName > insensitiveBName) {
    return 1
  }
  return 0
}
