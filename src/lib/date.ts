function pad(value: number): string {
  return value.toString().padStart(2, '0')
}

export function toLocalDateTimeFields(dueDt: string): { dueDate: string; dueTime: string } {
  const date = new Date(dueDt)
  const dueDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  const dueTime = `${pad(date.getHours())}:${pad(date.getMinutes())}`
  return { dueDate, dueTime }
}

export function formatDueDate(dueDt: string): string {
  const { dueDate, dueTime } = toLocalDateTimeFields(dueDt)
  return `${dueDate} | ${dueTime}`
}

export function toIsoFromDateTime(dueDate: string, dueTime: string): string | null {
  if (!dueDate) return null
  return new Date(`${dueDate}T${dueTime}`).toISOString()
}
