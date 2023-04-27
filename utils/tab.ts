export function focusTab(
  tab: string,
  tabsGroup: HTMLDivElement,
  indexedTabIds: string[]
) {
  const dsfrTabsGroup = window.dsfr(tabsGroup)
  if (!dsfrTabsGroup) return
  const tabIndex = indexedTabIds.findIndex(i => i === tab)
  if (tabIndex === -1) dsfrTabsGroup.tabsGroup.members[0].disclose()
  else dsfrTabsGroup.tabsGroup.members[tabIndex].disclose()
}
