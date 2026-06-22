<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  detail: string
}>()
</script>

<template>
  <article class="metric" :aria-label="`${label}: ${value}. ${detail}`">
    <span>{{ label }}</span>
    <strong>{{ value }}</strong>
    <small>{{ detail }}</small>
  </article>
</template>

<style scoped>
.metric {
  min-height: 9rem;
  border: 1px solid var(--line);
  border-radius: 0.5rem;
  background: var(--surface);
  box-shadow: var(--shadow);
  padding: 1rem;
}

.metric span,
.metric small {
  display: block;
  color: var(--muted);
}

.metric strong {
  display: block;
  margin: 0.55rem 0;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1;
}
</style>
