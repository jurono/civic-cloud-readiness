<script setup lang="ts">
import { computed } from 'vue'

import { getReadinessTone } from '@/composables/useReadinessTone'
import type { ReadinessSummary, ServiceStatus } from '@/domain/readiness'

const props = defineProps<{
  status: ReadinessSummary['status'] | ServiceStatus
}>()

const tone = computed(() => getReadinessTone(props.status))
</script>

<template>
  <span class="badge" :data-tone="tone">
    {{ status }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  min-height: 1.75rem;
  border-radius: 999px;
  padding: 0.25rem 0.7rem;
  font-size: 0.8rem;
  font-weight: 750;
  text-transform: capitalize;
}

.badge[data-tone='ok'] {
  background: rgb(19 121 91 / 12%);
  color: var(--ok);
}

.badge[data-tone='warning'] {
  background: rgb(181 106 18 / 13%);
  color: var(--warning);
}

.badge[data-tone='danger'] {
  background: rgb(180 35 24 / 12%);
  color: var(--danger);
}
</style>
