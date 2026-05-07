import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/projects',
      name: 'projectList',
      component: () => import('../views/ProjectListView.vue'),
    },
    {
      path: '/projects/:slug',
      name: 'projectDetail',
      component: () => import('../views/ProjectDetailView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
});

export default router;