import { formatDate } from '~/utils/formatDate'

type DeviceOption = {
  id: string
  startDate: Date | null
  endDate: Date | null
  deviceName: { id: string; name: string }
}

export function formatDeviceOption(device: DeviceOption) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const status =
    device.startDate && new Date(device.startDate) > today
      ? 'À venir'
      : !device.endDate || new Date(device.endDate) >= today
        ? 'En cours'
        : 'Terminé'
  const start = device.startDate ? formatDate(device.startDate) : ''
  const end = device.endDate ? ` → ${formatDate(device.endDate)}` : ' →'
  const datePart = start ? `${start}${end}` : ''
  const label = datePart
    ? `${device.deviceName.name} — ${status} — ${datePart}`
    : `${device.deviceName.name} — ${status}`
  return { value: device.id, label }
}
