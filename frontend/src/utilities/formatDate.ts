export function formatDate(date: Date) {
  return date.toISOString().slice(2, 10).split('-').reverse().join('/')
}
