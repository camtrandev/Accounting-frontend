export default [
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/modules/auth/pages/Login.vue')
      }
    ],
    meta: { requiresAuth: false }
  },
  {
    path: '/permission',
    name: 'Permission',
    component: () => import('@/modules/auth/pages/Permission.vue'),
    meta: { requiresAuth: true, role: 'Admin' }
  }
];