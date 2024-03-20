function removeDiacritics(pattern: string) {
  return pattern.normalize('NFKD').replace(/[\u0300-\u036F]/g, '')
}

function removeSpecialCharacters(pattern: string) {
  return pattern
    .replace(/[()//\\]/g, '')
    .replace(/\s\s+/g, ' ')
    .replace(/-/g, ' ')
}

export function formatSearchPattern(pattern: string) {
  return removeSpecialCharacters(removeDiacritics(pattern.trim())).toLowerCase()
}
