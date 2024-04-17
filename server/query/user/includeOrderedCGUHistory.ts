export function includeOrderedCGUHistory() {
  return {
    CGUHistory: {
      orderBy: {
        date: 'desc' as const
      }
    }
  }
}
