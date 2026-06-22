<script setup lang="ts">
import type { Region } from '@/domain/readiness'

defineProps<{
  regions: Region[]
  selectedRegion: Region | 'all'
}>()

const emit = defineEmits<{
  change: [region: Region | 'all']
}>()
</script>

<template>
  <fieldset class="filter">
    <legend>Region filter</legend>
    <button
      type="button"
      :aria-pressed="selectedRegion === 'all'"
      @click="emit('change', 'all')"
    >
      All
    </button>
    <button
      v-for="region in regions"
      :key="region"
      type="button"
      :aria-pressed="selectedRegion === region"
      @click="emit('change', region)"
    >
      {{ region }}
    </button>
  </fieldset>
</template>

<style scoped>
.filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  border: 0;
  margin: 0;
  padding: 0;
}

legend {
  width: 100%;
  margin-bottom: 0.25rem;
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 700;
}

button {
  min-height: 2.5rem;
  border: 1px solid var(--line);
  border-radius: 0.5rem;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  padding: 0.55rem 0.85rem;
}

button[aria-pressed='true'] {
  border-color: var(--accent);
  background: var(--accent-strong);
  color: white;
}
</style>
