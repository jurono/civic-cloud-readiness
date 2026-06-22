import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'operations',
      component: () => import('@/views/OperationsOverview.vue'),
    },
    {
      path: '/incidents',
      name: 'incidents',
      component: () => import('@/views/IncidentResponse.vue'),
    },
    {
      path: '/architecture',
      name: 'architecture',
      component: () => import('@/views/ArchitectureNotes.vue'),
    },
  ],
})
