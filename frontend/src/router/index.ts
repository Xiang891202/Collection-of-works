import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 公開路由（不變）
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/projects', name: 'projectList', component: () => import('../views/ProjectListView.vue') },
    { path: '/projects/:slug', name: 'projectDetail', component: () => import('../views/ProjectDetailView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    // 管理路由
    {
      path: '/admin',
      children: [
        { path: '', redirect: '/admin/login' },
        { path: 'login', name: 'adminLogin', component: () => import('../views/admin/AdminLoginView.vue') },
        {
          path: 'dashboard',
          name: 'adminDashboard',
          component: () => import('../views/admin/AdminDashboardView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'projects/new',
          component: () => import('../views/admin/AdminProjectLayout.vue'),
          meta: { requiresAuth: true },
          children: [
            { path: '', redirect: 'meta' },
            { path: 'meta', component: () => import('../views/admin/project/ProjectMetaEdit.vue') },
          ],
        },
        {
          path: 'projects/:id',
          component: () => import('../views/admin/AdminProjectLayout.vue'),
          meta: { requiresAuth: true },
          children: [
            { path: '', component: () => import('../views/admin/project/ProjectMetaEdit.vue') },  // 空路徑直接渲染，不重定向
            { path: 'meta', component: () => import('../views/admin/project/ProjectMetaEdit.vue') },
            { path: 'showcase', component: () => import('../views/admin/components/ShowcaseEditor.vue') },
            { path: 'professional', component: () => import('../views/admin/components/ProfessionalEditor.vue') },
            { path: 'case-study', component: () => import('../views/admin/components/CaseStudyEditor.vue') },
          ],
        },
      ],
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('admin_token');
  if (to.meta.requiresAuth && !token) next('/admin/login');
  else next();
});

export default router;