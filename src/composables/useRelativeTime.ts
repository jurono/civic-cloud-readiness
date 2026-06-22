import { computed, type Ref } from 'vue'

const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function useRelativeTime(value: Ref<string>) {
  return computed(() => {
    const deltaMs = new Date(value.value).getTime() - Date.now()
    const deltaHours = Math.round(deltaMs / 1000 / 60 / 60)

    if (Math.abs(deltaHours) < 24) {
      return formatter.format(deltaHours, 'hour')
    }

    return formatter.format(Math.round(deltaHours / 24), 'day')
  })
}
